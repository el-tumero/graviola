// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

struct CandidateExternal {
    uint256 id;
    string keyword;
    int256 score;
    address author;
}

enum VotingState {
    PENDING,
    OPENED,
    CLOSED
}

error WrongKeywordFormat();
error KeywordExpired();
error DoubleVoting();
error ZeroVoting();
error NoVoteBefore();

event CandidateAdded(uint256 id);
event CandidateUpvoted(uint256 id);
event CandidateDownvoted(uint256 id);
event CandidateCancelVote(uint256 id);
event CandidatePromoted(uint256 id);

interface IGraviolaSeasonsGovernor {
    function addCandidate(uint256 id) external;

    function upvoteCandidate(uint256 id) external;

    function downvoteCandidate(uint256 id) external;

    function cancelVoteCandidate(uint256 id) external;

    function promoteCandidate(uint256 id) external;

    function getCurrentVotingId() external view returns (uint256);

    function getVotingState(
        uint256 votingId
    ) external view returns (VotingState);

    function getCandidateScore(uint256 id) external view returns (uint256);

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
