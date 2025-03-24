// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GraviolaSeed} from "./GraviolaSeed.sol";
import {GraviolaCollection} from "./GraviolaCollection.sol";
import {AIOracleCallbackReceiver} from "../OAO/AIOracleCallbackReceiver.sol";
import {VRFV2PlusWrapperConsumerBase} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFV2PlusWrapperConsumerBase.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract GraviolaGenerator is
    GraviolaSeed,
    VRFV2PlusWrapperConsumerBase,
    AIOracleCallbackReceiver
{
    /// @dev Stable Diffusion 3 model id in the OAO
    uint256 private constant MODEL_ID = 503;

    /// @dev Callback gas limit for the VRF request
    uint32 private constant VRF_CALLBACK_GAS_LIMIT = 100000;

    /// @dev How many confirmations are needed for VRF request to be valid
    uint16 private constant VRF_REQUEST_CONFIRMATION = 3;

    /// @dev Number of words requested from VRF
    uint32 private constant VRF_NUM_WORDS = 1;

    /// @dev Callback gas limit for the OAO request
    uint64 private constant OAO_CALLBACK_GAS_LIMIT = 300000;

    GraviolaCollection private collection;

    event VRFRequestSent(address indexed initiator, uint256 generatorRequestId);
    event VRFRequestFulfilled(
        address indexed initiator,
        uint256 generatorRequestId
    );
    event OAORequestSent(address indexed initiator, uint256 generatorRequestId);
    event OAORequestFulfilled(
        address indexed initiator,
        uint256 generatorRequestId
    );

    error VRFRequestInsufficientBalance();
    error VRFRequestNotFound();

    error GeneratorRequestSeedNotSet();

    error OAORequestInsufficientBalance();
    error OAORequestNotFound();
    error OAORequestIllegal();

    error SenderNotInitiator();

    enum GeneratorRequestStatus {
        NON_EXISTENT, // GeneratorRequest hasn't been made
        VRF_WAIT, // GeneratorRequest is waiting for the VRF response
        VRF_RESPONSE, // GeneratorRequest received VRF response
        OAO_WAIT, // GeneratorRequest is waitng for the OAO response
        OAO_RESPONSE // GeneratorRequest received the OAO response, Request is completed
    }

    struct GeneratorRequest {
        GeneratorRequestStatus status;
        uint256 seed;
        address initiator;
        uint256 tokenId;
        uint256 balance;
    }

    mapping(uint256 => GeneratorRequest) private requests; // maps requestId to GeneratorRequest
    mapping(address => uint256[]) private userRequests; // maps user to array of requestIds

    constructor(
        address keywordsVaultAddress,
        address collectionAddress,
        address aiOracleAddress,
        address wrapperAddress
    )
        GraviolaSeed(keywordsVaultAddress)
        VRFV2PlusWrapperConsumerBase(wrapperAddress)
        AIOracleCallbackReceiver(aiOracleAddress)
    {
        collection = GraviolaCollection(collectionAddress);
    }

    function prepare() external payable {
        // request to the VRF service
        (uint256 generatorRequestId, uint256 reqPrice) = _requestRandomWords();
        // check if the VRF request price is higher than msg.value (native currency sent e.g. ETH)
        if (reqPrice > msg.value) {
            revert VRFRequestInsufficientBalance();
        }

        // add request to GeneratorRequests storage
        // set GeneratorRequest id as VRF's requestId
        requests[generatorRequestId] = GeneratorRequest({
            status: GeneratorRequestStatus.VRF_WAIT,
            seed: 0,
            initiator: msg.sender,
            tokenId: 0,
            balance: msg.value - reqPrice
        });
        // add requestId to userRequests storage
        userRequests[msg.sender].push(generatorRequestId);

        emit VRFRequestSent(msg.sender, generatorRequestId);
    }

    function _requestRandomWords() internal returns (uint256, uint256) {
        // prepare extraArgs for nativePayment
        bytes memory extraArgs = VRFV2PlusClient._argsToBytes(
            VRFV2PlusClient.ExtraArgsV1({nativePayment: true})
        );
        // send VRF request
        (uint256 requestId, uint256 reqPrice) = requestRandomnessPayInNative(
            VRF_CALLBACK_GAS_LIMIT,
            VRF_REQUEST_CONFIRMATION,
            VRF_NUM_WORDS,
            extraArgs
        );
        return (requestId, reqPrice);
    }

    // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        GeneratorRequest storage request = requests[_requestId];
        // check if the request with given id was created
        if (request.status != GeneratorRequestStatus.VRF_WAIT) {
            revert VRFRequestNotFound();
        }
        // attach random value to request (seed)
        request.seed = _randomWords[0];
        // change request status
        request.status = GeneratorRequestStatus.VRF_RESPONSE;
        emit VRFRequestFulfilled(request.initiator, _requestId);
    }

    function _generate(uint256 generatorRequestId, uint256 omega) internal {
        GeneratorRequest storage request = requests[generatorRequestId];
        // check if the request has random value attached
        if (request.status != GeneratorRequestStatus.VRF_RESPONSE) {
            revert GeneratorRequestSeedNotSet();
        }

        uint256 fee = aiOracle.estimateFee(MODEL_ID, OAO_CALLBACK_GAS_LIMIT);
        // check if fee for the OAO request is higher than request balance
        if (fee > request.balance) {
            revert OAORequestInsufficientBalance();
        }

        // perform process of selecting random words
        (string memory result, bytes memory wordIds) = rollWords(
            request.seed,
            omega
        );

        bytes memory prompt = bytes(
            string.concat(vault.getPromptBase(), result)
        );

        uint256 tokenId = uint256(keccak256(prompt));
        requests[generatorRequestId].tokenId = tokenId;

        collection.mint(tokenId, request.initiator);
        collection.addProperty(tokenId, "wordIds", wordIds);

        bytes memory callback = abi.encode(generatorRequestId, prompt);

        uint256 requestId = aiOracle.requestCallback{value: fee}(
            MODEL_ID,
            prompt,
            address(this),
            OAO_CALLBACK_GAS_LIMIT,
            callback
        );

        collection.addOaoRequestId(tokenId, requestId);
        request.status = GeneratorRequestStatus.OAO_WAIT;

        emit OAORequestSent(request.initiator, generatorRequestId);
    }

    function generate(uint256 generatorRequestId) external {
        _generate(generatorRequestId, DEFAULT_OMEGA);
    }

    function aiOracleCallback(
        uint256 requestId,
        bytes calldata output,
        bytes calldata callbackData
    ) external override onlyAIOracleCallback {
        (uint256 generatorRequestId, bytes memory prompt) = abi.decode(
            callbackData,
            (uint256, bytes)
        );
        GeneratorRequest storage request = requests[generatorRequestId];

        if (request.status != GeneratorRequestStatus.OAO_WAIT) {
            revert OAORequestNotFound();
        }

        if (collection.getOaoRequestId(request.tokenId) != requestId) {
            revert OAORequestIllegal();
        }

        collection.addAigcData(request.tokenId, prompt, output, bytes(""));

        request.status = GeneratorRequestStatus.OAO_RESPONSE;
        emit OAORequestFulfilled(request.initiator, generatorRequestId);
    }

    function estimateServiceFee() external view returns (uint256) {
        return
            aiOracle.estimateFee(MODEL_ID, OAO_CALLBACK_GAS_LIMIT) +
            i_vrfV2PlusWrapper.calculateRequestPriceNative(
                VRF_CALLBACK_GAS_LIMIT,
                1
            );
    }

    function getGeneratorRequestStatus(
        uint256 generatorRequestId
    ) external view returns (GeneratorRequestStatus) {
        return requests[generatorRequestId].status;
    }

    function getTokenId(uint256 requestId) external view returns (uint256) {
        return requests[requestId].tokenId;
    }

    function getUserGeneratorRequests(
        address user
    ) external view returns (uint256[] memory) {
        return userRequests[user];
    }

    function withdraw(uint256 requestId) external {
        GeneratorRequest storage request = requests[requestId];
        if (msg.sender != request.initiator) {
            revert SenderNotInitiator();
        }
        requests[requestId].balance = 0;
        payable(msg.sender).transfer(requests[requestId].balance);
    }
}
