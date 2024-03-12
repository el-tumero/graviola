// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface VRFHostConsumerInterface {
    enum RoundState {
        EMPTY,
        PROPOSAL,
        FINAL
    }
    struct Round {
        address proposer;
        uint256 randomNumber;
        bytes32 randomNumberHash;
        RoundState state;
        uint256 blockHeight;
    }

    function getRound(uint32 id) external view returns (Round memory);

    function getCurrentRoundId() external view returns (uint32);
}
