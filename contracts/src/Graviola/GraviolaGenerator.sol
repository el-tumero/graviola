// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GraviolaSeed} from "./GraviolaSeed.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IGraviolaCollection} from "./IGraviolaCollection.sol";
import {IAIOracle} from "../OAO/IAIOracle.sol";

import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {VRFV2PlusWrapperConsumerBase} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFV2PlusWrapperConsumerBase.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract GraviolaGenerator is
    GraviolaSeed,
    VRFV2PlusWrapperConsumerBase,
    ConfirmedOwner
{
    string internal constant PROMPT_BASE =
        "Generate a minimalistic portrait of a fictional character. Use a solid color background. The main features of this character are: ";

    IERC20 private token;
    IGraviolaCollection private collection;
    IAIOracle private aiOracle;

    event RequestVRFSent(uint256 requestId);
    event RequestVRFFulfilled(uint256 requestId);
    event RequestOAOSent(uint256 requestId);
    event RequestOAOFulfilled(uint256 requestId);

    error RequestVRFNotFound();
    error RequestSeedNotFound();

    error SenderNotInitiator();

    enum RequestStatus {
        NON_EXISTENT,
        VRF_WAIT,
        VRF_RESPONSE,
        OAO_WAIT,
        OAO_RESPONSE
    }

    struct Request {
        RequestStatus status;
        uint256 seed;
        address initiator;
    }

    mapping(uint256 => Request) requests;

    uint32 private constant callbackGasLimit = 100000;
    uint16 private constant requestConfirmations = 3;
    uint32 private constant numWords = 1;

    constructor(
        address tokenAddress,
        address archiveAddress,
        address collectionAddress,
        address aiOracleAddress,
        address wrapperAddress
    )
        GraviolaSeed(archiveAddress)
        ConfirmedOwner(msg.sender)
        VRFV2PlusWrapperConsumerBase(wrapperAddress)
    {
        token = IERC20(tokenAddress);
        collection = IGraviolaCollection(collectionAddress);
        aiOracle = IAIOracle(aiOracleAddress);
    }

    function prepare() external payable {
        (uint256 requestId, ) = requestRandomWords();
        requests[requestId] = Request({
            status: RequestStatus.VRF_WAIT,
            seed: 0,
            initiator: msg.sender
        });
        emit RequestVRFSent(requestId);
    }

    function requestRandomWords()
        internal
        onlyOwner
        returns (uint256, uint256)
    {
        bytes memory extraArgs = VRFV2PlusClient._argsToBytes(
            VRFV2PlusClient.ExtraArgsV1({nativePayment: true})
        );
        (uint256 requestId, uint256 reqPrice) = requestRandomnessPayInNative(
            callbackGasLimit,
            requestConfirmations,
            numWords,
            extraArgs
        );
        return (requestId, reqPrice);
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        Request storage request = requests[_requestId];
        if (request.status != RequestStatus.VRF_WAIT) {
            revert RequestVRFNotFound();
        }
        request.seed = _randomWords[0];
        request.status = RequestStatus.VRF_RESPONSE;
        emit RequestVRFFulfilled(_requestId);
    }

    function generate(uint256 requestId) external {
        Request storage request = requests[requestId];
        if (request.status != RequestStatus.VRF_RESPONSE) {
            revert RequestSeedNotFound();
        }
        if (request.initiator != msg.sender) {
            revert SenderNotInitiator();
        }

        // request.seed

        // OAO request
    }
}
