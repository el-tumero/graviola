// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IGraviolaSeasonsArchive} from "../archive/IGraviolaSeasonsArchive.sol";
import {GraviolaSeasonsCandidates} from "./GraviolaSeasonsCandidates.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
// solhint-disable-next-line no-global-import
import "./IGraviolaSeasonsGovernor.sol";

/// @title GraviolaSeasonsGovernor
/// @notice Contract created for coordinating seasonal votings for keywords
/// that will be later used during generation process of non fungible tokens
/// from GraviolaCollection
contract GraviolaSeasonsGovernor is
    IGraviolaSeasonsGovernor,
    GraviolaSeasonsCandidates
{
    uint256 private constant MAX_LIST_SIZE = 100;

    IGraviolaSeasonsArchive private immutable ARCHIVE;
    ERC20Votes private immutable TOKEN;

    struct Voting {
        uint256 startTimestamp; // Voting start timestamp
        VotingState state; // State of the voting
    }

    uint256 private currentVotingId = 0;
    // Stores votings
    mapping(uint256 => Voting) private voting;
    // Stores how much voting power is given to specified candidate by specified voter (address)
    mapping(address => mapping(uint256 => int256)) private voters;

    /// @notice Create a new GraviolaSeasonGovernor contract
    /// @param archiveAddress GraviolaSeasonsArchive address
    /// @param tokenAddress GraviolaToken address
    constructor(
        address archiveAddress,
        address tokenAddress
    ) GraviolaSeasonsCandidates(MAX_LIST_SIZE) {
        ARCHIVE = IGraviolaSeasonsArchive(archiveAddress);
        TOKEN = ERC20Votes(tokenAddress);
    }

    /// @notice Validate if a given keyword can become a candidate
    /// @dev Check if bytes of the keyword are in range [97, 122];
    /// (Check if keyword is is made of lowercase letters)
    /// @param keyword string representation of a keyword
    /// @return isValid true if keyword is valid
    function _validateKeyword(
        string memory keyword
    ) private pure returns (bool) {
        bytes memory b = bytes(keyword);
        if (b.length == 0) return false;
        for (uint256 i = 0; i < b.length; i++) {
            uint8 char = uint8(b[i]);
            if (char == 0) break;
            if (char < 97 || char > 122) return false;
        }
        return true;
    }

    /// @notice Adds a new candidate with given id to the CandidatesCollection
    /// @dev Emits CandidateAdded(id) event on success
    /// Reverts with WrongKeywordFormat or KeywordIsExpired on error
    /// @param id uint256 representation of a keyword
    function addCandidate(uint256 id) external {
        string memory keyword = _decodeKeyword(id);
        if (!_validateKeyword(keyword)) revert WrongKeywordFormat();
        if (ARCHIVE.isKeywordExpired(keyword)) revert KeywordExpired();
        _addCandidate(id);
        emit CandidateAdded(id);
    }

    /// @notice Upvote candidate with given id - add value equal
    /// to the voting power of the voter to the candidate's score.
    /// Depending on the state of the CandidatesList candidate:
    /// - is added to the CandidatesList at the appropriate position
    /// - their position change after vote
    /// - their position does not change after vote
    /// @dev Emits CandidateUpvoted(id) event on success
    /// Reverts with DoubleVoting or ZeroVoting on error
    /// @param id uint256 representation of a keyword
    function upvoteCandidate(uint256 id) external {
        if (voters[msg.sender][id] != 0) revert DoubleVoting();
        // Read token balance of the voter from the snapshot
        uint256 votes = TOKEN.getPastVotes(
            msg.sender,
            voting[currentVotingId].startTimestamp
        );
        if (votes == 0) revert ZeroVoting();
        _upvoteCandidate(id, votes);
        voters[msg.sender][id] = int256(votes);
        emit CandidateUpvoted(id);
    }

    /// @notice Downvote candidate with given id - substract value equal
    /// to the voting power of the voter from the candidate's score.
    /// Depending on state of the CandidatesList candidate:
    /// - is removed from the CandidatesList
    /// - their position change after vote
    /// - their position does not change after vote
    /// @dev Emits CandidateDownvoted(id) event on success
    /// Reverts with DoubleVoting or ZeroVoting on error
    /// @param id uint256 representation of a keyword
    function downvoteCandidate(uint256 id) external {
        if (voters[msg.sender][id] != 0) revert DoubleVoting();
        // Read token balance of the voter from the snapshot
        uint256 votes = TOKEN.getPastVotes(
            msg.sender,
            voting[currentVotingId].startTimestamp
        );
        if (votes == 0) revert ZeroVoting();
        _downvoteCandidate(id, votes);
        voters[msg.sender][id] = int256(votes) * (-1);
        emit CandidateDownvoted(id);
    }

    /// @notice Cancel a vote cast by voter for candidate with given id
    /// @dev Emits CandidateCancelVote(id) event on success
    /// Reverts with NoVoteBefore on error
    /// @param id uint256 representation of a keyword
    function cancelVoteCandidate(uint256 id) external {
        // votes cast by msg.sender for candidate with given id
        int256 votes = voters[msg.sender][id];
        if (votes == 0) revert NoVoteBefore();
        // if the voter has upvoted before - the candidate is downvoted with value
        // equal to the voting power previously added to the score
        if (votes > 0) _downvoteCandidate(id, uint256(votes));
        // if the voter has downvoted before - the candidate is downvoted with value
        // equal to the voting power previously added to the score
        if (votes < 0) _upvoteCandidate(id, uint256(votes * (-1)));
        voters[msg.sender][id] = 0;
        emit CandidateCancelVote(id);
    }

    /// @notice Promote (add) candidate with given id to the CandidatesList
    /// Function can be called if candidate with given id has score greater
    /// then the 100th (worst) candidate on the CandidatesList
    /// NOTE: the candidate must be added to the CandidatesCollection beforehand
    /// by executing addCandidate function
    /// @param id uint256 representation of a keyword
    function promoteCandidate(uint256 id) external {
        _promoteCandidate(id);
        emit CandidatePromoted(id);
    }

    /// @notice Perform snapshot for the current Voting by saving
    /// current block.timestamp and changing voting state to OPENED
    function snapshot() external {
        Voting storage currentVoting = voting[currentVotingId];
        currentVoting.startTimestamp = block.timestamp;
        currentVoting.state = VotingState.OPENED;
    }

    /// @notice Return id of the current Voting
    function getCurrentVotingId() external view returns (uint256) {
        return currentVotingId;
    }

    /// @notice Return state of the Voting with given id
    /// @param votingId id of the Voting
    function getVotingState(
        uint256 votingId
    ) external view returns (VotingState) {
        return voting[votingId].state;
    }

    /// @notice Return score of candidate with given id
    /// @param id uint256 representation of a keyword
    function getCandidateScore(uint256 id) external view returns (uint256) {
        return getValue(id);
    }

    /// @notice Return id of top n candidates
    /// @param size number of top candidates to return in array (array size)
    /// @dev size must be smaller or equal then CandidatesList size
    function getTopCandidates(
        uint256 size
    ) external view returns (uint256[] memory) {
        return _getTopCandidates(size);
    }

    /// @notice Return info about top n candidates
    /// @param size number of top candidates to return in array (array size)
    /// @dev size must be smaller or equal then CandidatesList size
    function getTopCandidatesInfo(
        uint256 size
    ) external view returns (CandidateExternal[] memory) {
        return _getTopCandidatesInfo(size);
    }

    /// @notice Return true if candidate with given id is in the CandidatesCollection
    function isCandidateInCollection(uint256 id) external view returns (bool) {
        return _isCandidateInCollection(id);
    }

    /// @notice Return true if candidate with given id is in the CandidatesList
    function isCandidateInList(uint256 id) external view returns (bool) {
        return _isCandidateInList(id);
    }

    /// @notice Return worst score in the CandidatesList
    function getWorstCandidateScore() external view returns (int256) {
        return _getWorstScoreList();
    }

    /// @notice Return current list size
    function getCandidateListSize() external view returns (uint256) {
        return _getListSize();
    }
}
