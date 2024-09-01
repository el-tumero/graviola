// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GraviolaSeed} from "./GraviolaSeed.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IGraviolaCollection} from "./IGraviolaCollection.sol";
import {Metadata} from "./GraviolaMetadata.sol";
import {AIOracleCallbackReceiver} from "../OAO/AIOracleCallbackReceiver.sol";

import {VRFV2PlusWrapperConsumerBase} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFV2PlusWrapperConsumerBase.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract GraviolaGenerator is
    GraviolaSeed,
    VRFV2PlusWrapperConsumerBase,
    AIOracleCallbackReceiver
{
    /// @dev Stable Diffusion model id in the OAO
    uint256 private constant MODEL_ID = 50;

    /// @dev Callback gas limit for the VRF request
    uint32 private constant VRF_CALLBACK_GAS_LIMIT = 100000;

    /// @dev How many confirmations are needed for VRF request to be valid
    uint16 private constant VRF_REQUEST_CONFIRMATION = 3;

    /// @dev Number of words requested from VRF
    uint32 private constant VRF_NUM_WORDS = 1;

    /// @dev Callback gas limit for the OAO request
    uint64 private constant OAO_CALLBACK_GAS_LIMIT = 150000;

    IERC20 private token;
    IGraviolaCollection private collection;

    event RequestVRFSent(address indexed initiator, uint256 requestId);
    event RequestVRFFulfilled(address indexed initiator, uint256 requestId);
    event RequestOAOSent(address indexed initiator, uint256 requestId);
    event RequestOAOFulfilled(address indexed initiator, uint256 requestId);

    error RequestVRFInsufficientBalance();
    error RequestOAOInsufficientBalance();
    error RequestVRFNotFound();
    error RequestSeedNotFound();

    error SenderNotInitiator();
    error RequestOAONotFound();
    error TradeUpIllegal();

    enum RequestStatus {
        NON_EXISTENT, // Request hasn't been made
        VRF_WAIT, // Request is waiting for the VRF response
        VRF_RESPONSE, // Request received VRF response
        OAO_WAIT, // Request is waitng for the OAO response
        OAO_RESPONSE // Request received the OAO response
    }

    struct Request {
        RequestStatus status;
        uint256 seed;
        address initiator;
        uint256 oaoRequestId;
        uint256 balance;
    }

    mapping(uint256 => Request) private requests;
    mapping(uint256 => uint256) private oaoRequestIds;

    constructor(
        address tokenAddress,
        address archiveAddress,
        address collectionAddress,
        address aiOracleAddress,
        address wrapperAddress
    )
        GraviolaSeed(archiveAddress)
        VRFV2PlusWrapperConsumerBase(wrapperAddress)
        AIOracleCallbackReceiver(aiOracleAddress)
    {
        token = IERC20(tokenAddress);
        collection = IGraviolaCollection(collectionAddress);
    }

    function prepare() external payable {
        // request to the VRF service
        (uint256 requestId, uint256 reqPrice) = _requestRandomWords();
        // check if the VRF request price is higher than msg.value (native currency sent e.g. ETH)
        if (reqPrice > msg.value) {
            revert RequestVRFInsufficientBalance();
        }

        // add request to requests storage
        requests[requestId] = Request({
            status: RequestStatus.VRF_WAIT,
            seed: 0,
            initiator: msg.sender,
            oaoRequestId: 0,
            balance: msg.value - reqPrice
        });
        emit RequestVRFSent(msg.sender, requestId);
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
        Request storage request = requests[_requestId];
        // check if the request with given id was created
        if (request.status != RequestStatus.VRF_WAIT) {
            revert RequestVRFNotFound();
        }
        // attach random value to request (seed)
        request.seed = _randomWords[0];
        // change request status
        request.status = RequestStatus.VRF_RESPONSE;
        emit RequestVRFFulfilled(request.initiator, _requestId);
    }

    function _generate(uint256 requestId, uint256 omega) internal {
        Request storage request = requests[requestId];
        // check if the request has random value attached
        if (request.status != RequestStatus.VRF_RESPONSE) {
            revert RequestSeedNotFound();
        }

        uint256 fee = aiOracle.estimateFee(MODEL_ID, OAO_CALLBACK_GAS_LIMIT);
        // check if fee for the OAO request is higher than request balance
        if (fee > request.balance) {
            revert RequestOAOInsufficientBalance();
        }

        // perform process of selecting random words
        (string memory result, uint256 score, uint256 probability) = rollWords(
            request.seed,
            omega
        );

        uint256 tokenId = collection.mint(request.initiator);
        uint256 seasonId = archive.getCurrentSeasonId();
        string memory promptBase = archive.getSeasonPromptBase(seasonId);

        Metadata memory metadata = Metadata({
            description: string.concat(promptBase, result),
            image: "",
            probability: probability,
            score: score,
            seasonId: seasonId,
            isReady: false
        });

        collection.createMetadata(tokenId, metadata);

        uint256 oaoRequestId = aiOracle.requestCallback{value: fee}(
            MODEL_ID,
            bytes(string.concat(promptBase, result)),
            address(this),
            OAO_CALLBACK_GAS_LIMIT,
            abi.encode(tokenId)
        );

        oaoRequestIds[oaoRequestId] = requestId;
        request.status = RequestStatus.OAO_WAIT;

        emit RequestOAOSent(request.initiator, requestId);
    }

    function generate(uint256 requestId) external {
        _generate(requestId, DEFAULT_OMEGA);
    }

    function tradeUp(
        uint256 requestId,
        uint256[] memory tokensToBurn
    ) external {
        uint256 totalScore = 0;
        if (tokensToBurn.length != 3) {
            revert TradeUpIllegal();
        }

        for (uint256 i = 0; i < 3; i++) {
            if (collection.ownerOf(tokensToBurn[i]) != msg.sender) {
                revert TradeUpIllegal();
            }
            totalScore += collection.getMetadata(tokensToBurn[i]).score;
            collection.burnByOwner(tokensToBurn[i]);
        }

        _generate(requestId, DEFAULT_OMEGA - totalScore);
    }

    function aiOracleCallback(
        uint256 requestId,
        bytes calldata output,
        bytes calldata callbackData
    ) external override onlyAIOracleCallback {
        uint256 i_requestId = oaoRequestIds[requestId];
        Request storage request = requests[i_requestId];

        if (request.status != RequestStatus.OAO_WAIT) {
            revert RequestOAONotFound();
        }
        uint256 tokenId = abi.decode(callbackData, (uint256));

        collection.addImage(tokenId, string(output));
        request.status = RequestStatus.OAO_RESPONSE;
        emit RequestOAOFulfilled(request.initiator, i_requestId);
    }

    function estimateServiceFee() external view returns (uint256) {
        return
            aiOracle.estimateFee(MODEL_ID, OAO_CALLBACK_GAS_LIMIT) +
            i_vrfV2PlusWrapper.calculateRequestPriceNative(
                VRF_CALLBACK_GAS_LIMIT,
                1
            );
    }

    function getRequestStatus(
        uint256 requestId
    ) external view returns (RequestStatus) {
        return requests[requestId].status;
    }

    function withdraw(uint256 requestId) external {
        Request storage request = requests[requestId];
        if (msg.sender != request.initiator) {
            revert SenderNotInitiator();
        }
        payable(msg.sender).transfer(requests[requestId].balance);
    }
}
