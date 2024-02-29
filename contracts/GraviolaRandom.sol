// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

abstract contract GraviolaRandom is VRFConsumerBaseV2{
    VRFCoordinatorV2Interface immutable COORDINATOR;

    event RequestSent(uint256 requestId);
    
    bytes32 immutable s_keyHash;
    uint64 immutable s_subscriptionId;

    uint32 constant CALLBACK_GAS_LIMIT = 100000;
    uint16 constant REQUEST_CONFIRMATIONS = 3;
    uint32 constant NUM_WORDS = 1;

    struct Request {
        address requestor;
        bool fulfilled;
        bool exists;
        uint256[] randomWords;
    }

    mapping(uint256=>Request) internal s_requests;

    constructor(
        uint64 subscriptionId,
        address vrfCoordinator,
        bytes32 keyHash
    ) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_keyHash = keyHash;
        s_subscriptionId = subscriptionId;
    }

    function requestRandomWords() internal {
        uint256 requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            REQUEST_CONFIRMATIONS,
            CALLBACK_GAS_LIMIT,
            NUM_WORDS
        );
        s_requests[requestId] = Request({
            requestor: msg.sender,
            fulfilled: false,
            exists: true,
            randomWords: new uint256[](0)
        });
        emit RequestSent(requestId);
    }

    // debug view func
    function getRequestStatus(uint256 requestId) external view returns(Request memory) {
        return s_requests[requestId];
    }

}