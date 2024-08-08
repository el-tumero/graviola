// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GraviolaSeed} from "./GraviolaSeed.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IGraviolaCollection} from "./IGraviolaCollection.sol";
import {IAIOracle} from "../OAO/IAIOracle.sol";
import {Metadata} from "./GraviolaMetadata.sol";

import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {VRFV2PlusWrapperConsumerBase} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFV2PlusWrapperConsumerBase.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract GraviolaGenerator is GraviolaSeed, VRFV2PlusWrapperConsumerBase {
    /// @dev Base of the prompt used for the OAO
    // string private constant PROMPT_BASE =
    // "Generate a minimalistic portrait of a fictional character. Use a solid color background. The main features of this character are: ";

    /// @dev Stable Diffusion model id in the OAO
    uint256 private constant MODEL_ID = 50;

    /// @dev Callback gas limit for the VRF request
    uint32 private constant VRF_CALLBACK_GAS_LIMIT = 100000;

    /// @dev How many confirmations are needed for VRF request to be valid
    uint16 private constant VRF_REQUEST_CONFIRMATION = 3;

    /// @dev Number of words requested from VRF
    uint32 private constant VRF_NUM_WORDS = 1;

    /// @dev Callback gas limit for the OAO request
    uint64 private constant OAO_CALLBACK_GAS_LIMIT = 100000;

    IERC20 private token;
    IGraviolaCollection private collection;
    IAIOracle private aiOracle;

    event RequestVRFSent(uint256 requestId);
    event RequestVRFFulfilled(uint256 requestId);
    event RequestOAOSent(uint256 requestId);
    event RequestOAOFulfilled(uint256 requestId);

    error RequestVRFInsufficientBalance();
    error RequestOAOInsufficientBalance();
    error RequestVRFNotFound();
    error RequestSeedNotFound();

    error SenderNotInitiator();

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
        uint256 balance;
    }

    mapping(uint256 => Request) requests;

    constructor(
        address tokenAddress,
        address archiveAddress,
        address collectionAddress,
        address aiOracleAddress,
        address wrapperAddress
    )
        GraviolaSeed(archiveAddress)
        VRFV2PlusWrapperConsumerBase(wrapperAddress)
    {
        token = IERC20(tokenAddress);
        collection = IGraviolaCollection(collectionAddress);
        aiOracle = IAIOracle(aiOracleAddress);
    }

    function prepare() external payable {
        // request to the VRF service
        (uint256 requestId, uint256 reqPrice) = requestRandomWords();
        // check if the VRF request price is higher than msg.value (native currency sent e.g. ETH)
        if (reqPrice > msg.value) {
            revert RequestVRFInsufficientBalance();
        }

        // add request to requests storage
        requests[requestId] = Request({
            status: RequestStatus.VRF_WAIT,
            seed: 0,
            initiator: msg.sender,
            balance: msg.value - reqPrice
        });
        emit RequestVRFSent(requestId);
    }

    function requestRandomWords() internal returns (uint256, uint256) {
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
        emit RequestVRFFulfilled(_requestId);
    }

    function generate(uint256 requestId) external {
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
        (
            string memory result,
            uint256 weightSum,
            uint256 totalProbability
        ) = rollWords(request.seed);

        uint256 tokenId = collection.mint(request.initiator);
        uint256 seasonId = archive.getCurrentSeasonId();
        string memory promptBase = archive.getSeasonPromptBase(seasonId);

        Metadata memory metadata = Metadata({
            description: result,
            image: "",
            rarity: totalProbability,
            weightSum: weightSum,
            seasonId: seasonId,
            isReady: false
        });

        collection.createMetadata(tokenId, metadata);

        aiOracle.requestCallback{value: fee}(
            MODEL_ID,
            bytes(string.concat(promptBase, result)),
            address(this),
            OAO_CALLBACK_GAS_LIMIT,
            abi.encode(tokenId)
        );

        emit RequestOAOSent(requestId);
    }
}
