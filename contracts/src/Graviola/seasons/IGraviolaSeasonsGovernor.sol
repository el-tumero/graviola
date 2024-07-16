// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

struct CandidateExternal {
    uint256 id;
    int256 score;
    address author;
}

enum VotingState {
    PENDING,
    OPENED,
    CLOSED
}

error WrongWordFormat();
error WordExpired();
error DoubleVoting();
error ZeroVoting();
error NoVoteBefore();

event CandidateAdded(uint256 word);
event CandidateUpvoted(uint256 word);
event CandidateDownvoted(uint256 word);
event CandidateUndoVote(uint256 word);
event CandidatePromoted(uint256 word);

interface IGraviolaSeasonsGovernor {
    function addCandidate(uint256 word) external;
    function upvoteCandidate(uint256 word) external;
    function downvoteCandidate(uint256 word) external;
    function undoVoteCandidate(uint256 word) external;
    function promoteCandidate(uint256 word) external;
    function getCurrentVotingId() external view returns (uint256);
    function getVotingState(
        uint256 votingId
    ) external view returns (VotingState);
    function getCandidateScore(uint256 word) external view returns (uint256);
    function getTopCandidates(
        uint256 size
    ) external view returns (uint256[] memory);
    function getTopCandidatesInfo(
        uint256 size
    ) external view returns (CandidateExternal[] memory);
    function isCandidateExist(uint256 id) external view returns (bool);
    function getWorstCandidateScore() external view returns (int256);
    function getCandidateListSize() external view returns (uint256);
}
