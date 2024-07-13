// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IGraviolaSeasonsGovernor {
    enum VotingState {
        PENDING,
        OPENED,
        CLOSED
    }

    function addCandidate(uint256 word) external;
    function upvoteCandidate(uint256 word) external;
    function downvoteCandidate(uint256 word) external;
    function undoVoteCandidate(uint256 word) external;
    function promoteCandidate(uint256 word) external;
    function getCurrentVotingId() external view returns (uint256);
    function getVotingState(
        uint256 votingId
    ) external view returns (VotingState);
}
