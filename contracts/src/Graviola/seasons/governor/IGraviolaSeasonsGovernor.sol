// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Candidate view struct
struct CandidateExternal {
    uint256 id;
    string keyword;
    int256 score;
    address author;
}

/// @notice Enum representing Voting states
enum VotingState {
    PENDING,
    OPENED,
    CLOSED
}

/// @notice WrongKeywordFormat error is emmited in the addCandidate
/// function if the given keyword has wrong format
error WrongKeywordFormat();

/// @notice KeywordExpired error is emmited in the addCandidate
/// function if the given keyword has expired status
error KeywordExpired();

/// @notice DoubleVoting error is emmited in upvoteCandidate,
/// downvoteCandidate functions if the specific address
/// try to vote second time for the same candidate
error DoubleVoting();

/// @notice ZeroVoting is emmited in upvoteCandidate,
/// downvoteCandidate functions if specific address
/// try to vote, but doesn't have any voting power
error ZeroVoting();

/// @notice NoVoteBefore is emmited in the cancelVoteCandidate
/// function if the specific address has not made any vote before
/// for the given candidate
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

    function isCandidateInCollection(uint256 id) external view returns (bool);

    function isCandidateInList(uint256 id) external view returns (bool);

    function getWorstCandidateScore() external view returns (int256);

    function getCandidateListSize() external view returns (uint256);
}
