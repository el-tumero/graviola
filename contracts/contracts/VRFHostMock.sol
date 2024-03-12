// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./VRFHostConsumerInterface.sol";

contract VRFHostMock is VRFHostConsumerInterface {
    mapping(uint32 => Round) private rounds;
    uint32 private currRoundId = 0;

    function addRound(uint256 value) external {
        rounds[currRoundId] = Round({
            proposer: address(0),
            randomNumber: value,
            randomNumberHash: keccak256(abi.encode(value)),
            state: RoundState.FINAL,
            blockHeight: block.number
        });
        currRoundId++;
    }

    function getRound(uint32 id) external view override returns (Round memory) {
        return rounds[id];
    }

    function getCurrentRoundId() external view override returns (uint32) {
        return currRoundId;
    }
}
