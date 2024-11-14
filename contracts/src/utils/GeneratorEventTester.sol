// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract GeneratorEventTester {
    event RequestVRFSent(address indexed initiator, uint256 requestId);
    event RequestVRFFulfilled(address indexed initiator, uint256 requestId);
    event RequestOAOSent(address indexed initiator, uint256 requestId);
    event RequestOAOFulfilled(address indexed initiator, uint256 requestId);

    function triggerRequestVRFSent(
        address initiator,
        uint256 requestId
    ) public {
        emit RequestVRFSent(initiator, requestId);
    }

    function triggerRequestVRFFulfilled(
        address initiator,
        uint256 requestId
    ) public {
        emit RequestVRFFulfilled(initiator, requestId);
    }

    function triggerRequestOAOSent(
        address initiator,
        uint256 requestId
    ) public {
        emit RequestOAOSent(initiator, requestId);
    }

    function triggerRequestOAOFulfilled(
        address initiator,
        uint256 requestId
    ) public {
        emit RequestOAOFulfilled(initiator, requestId);
    }
}
