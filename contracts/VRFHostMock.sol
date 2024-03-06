// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./VRFHostConsumerInterface.sol";

contract VRFHostMock is VRFHostConsumerInterface {

    mapping(uint32=>Round) private rounds;

    function addRound(uint32 id, uint256 value) external {
        rounds[id] = Round({
            proposer: address(0),
            randomNumber: value,
            randomNumberHash: keccak256(abi.encode(value)),
            state: RoundState.FINAL,
            blockHeight: block.number
        });
    }

    function getRound(uint32 id) external view override returns (Round memory) {}

    function getCurrentRoundId() external view override returns (uint32) {}
}

