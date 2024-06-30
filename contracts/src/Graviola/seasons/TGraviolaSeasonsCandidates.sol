// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


import {GraviolaSeasonsCandidates} from "./GraviolaSeasonsCandidates.sol";

contract TGraviolaSeasonsCandidates is GraviolaSeasonsCandidates {
    constructor(uint256 listSize) GraviolaSeasonsCandidates(listSize) {}


    function addCandidate(uint256 id) external {
        _addCandidate(id);
    }

    function downvoteCandidate(uint256 id, uint256 votingPower) external {
        _downvoteCandidate(id, votingPower);
    }

    function promoteCandidate(uint256 id) external {
        _promoteCandidate(id);
    }

    function upvoteCandidate(uint256 id, uint256 votingPower) external {
        _upvoteCandidate(id, votingPower);
    }
}