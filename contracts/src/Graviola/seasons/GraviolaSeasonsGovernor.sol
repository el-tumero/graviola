// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IGraviolaSeasonsArchive.sol";
import "./GraviolaSeasonsCandidates.sol";
import "./IGraviolaSeasonsGovernor.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract GraviolaSeasonsGovernor is
    IGraviolaSeasonsGovernor,
    GraviolaSeasonsCandidates
{
    IGraviolaSeasonsArchive immutable archive;
    ERC20Votes immutable token;

    struct Voting {
        uint256 startTimestamp;
        VotingState state;
    }

    uint256 private currentVotingId = 0;
    mapping(uint256 => Voting) private voting;
    mapping(address => mapping(uint256 => int256)) private voters;

    constructor(
        address archiveAddress,
        address tokenAddress
    ) GraviolaSeasonsCandidates(100) {
        archive = IGraviolaSeasonsArchive(archiveAddress);
        token = ERC20Votes(tokenAddress);
    }

    function validateWord(string memory str) private pure returns (bool) {
        bytes memory b = bytes(str);
        if (b.length == 0) return false;
        for (uint256 i = 0; i < b.length; i++) {
            uint8 char = uint8(b[i]);
            if (char == 0) break;
            if (char < 97 || char > 122) return false;
        }
        return true;
    }

    function uint256ToBytes(uint256 n) internal pure returns (bytes memory) {
        bytes memory b = new bytes(32);
        assembly {
            mstore(add(b, 32), n)
        }
        return b;
    }

    function addCandidate(uint256 word) external {
        string memory wordStr = string(uint256ToBytes(word));
        if (!validateWord(wordStr)) revert WrongWordFormat();
        if (archive.isWordExpired(wordStr)) revert WordExpired();

        _addCandidate(word);
        emit CandidateAdded(word);
    }

    function upvoteCandidate(uint256 word) external {
        if (voters[msg.sender][word] != 0) revert DoubleVoting();
        uint256 votes = token.getPastVotes(
            msg.sender,
            voting[currentVotingId].startTimestamp
        );
        if (votes == 0) revert ZeroVoting();
        _upvoteCandidate(word, votes);
        voters[msg.sender][word] = int256(votes);
        emit CandidateUpvoted(word);
    }

    function downvoteCandidate(uint256 word) external {
        if (voters[msg.sender][word] != 0) revert DoubleVoting();
        uint256 votes = token.getPastVotes(
            msg.sender,
            voting[currentVotingId].startTimestamp
        );
        if (votes == 0) revert ZeroVoting();
        _downvoteCandidate(word, votes);
        voters[msg.sender][word] = int256(votes) * (-1);
        emit CandidateDownvoted(word);
    }

    function undoVoteCandidate(uint256 word) external {
        int256 votes = voters[msg.sender][word];
        if (votes == 0) revert NoVoteBefore();
        if (votes > 0) _downvoteCandidate(word, uint256(votes));
        if (votes < 0) _upvoteCandidate(word, uint256(votes * (-1)));
        voters[msg.sender][word] = 0;
        emit CandidateUndoVote(word);
    }

    function promoteCandidate(uint256 word) external {
        _promoteCandidate(word);
        emit CandidatePromoted(word);
    }

    function snapshot() external {
        Voting storage currentVoting = voting[currentVotingId];
        currentVoting.startTimestamp = block.timestamp;
        currentVoting.state = VotingState.OPENED;
    }

    function getCurrentVotingId() external view returns (uint256) {
        return currentVotingId;
    }

    function getVotingState(
        uint256 votingId
    ) external view returns (VotingState) {
        return voting[votingId].state;
    }

    function getCandidateScore(uint256 word) external view returns (uint256) {
        return getValue(word);
    }

    function getTopCandidates(
        uint256 size
    ) external view returns (uint256[] memory) {
        return _getTopCandidates(size);
    }

    function getTopCandidatesInfo(
        uint256 size
    ) external view returns (CandidateExternal[] memory) {
        return _getTopCandidatesInfo(size);
    }

    function isCandidateExist(uint256 id) external view returns (bool) {
        return _isCandidateExist(id);
    }

    function getWorstCandidateScore() external view returns (int256) {
        return _getWorstScoreList();
    }

    function getCandidateListSize() external view returns (uint256) {
        return _getListSize();
    }




}
