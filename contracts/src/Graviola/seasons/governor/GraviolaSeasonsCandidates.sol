// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {StructuredLinkedList, IStructureInterface} from "solidity-linked-list/contracts/StructuredLinkedList.sol";
import {CandidateExternal} from "./IGraviolaSeasonsGovernor.sol";
import {KeywordConverter} from "../../../utils/KeywordConverter.sol";

abstract contract GraviolaSeasonsCandidates is
    IStructureInterface,
    KeywordConverter
{
    using StructuredLinkedList for StructuredLinkedList.List;

    /// @notice CandidateAlreadyInCollection error is emitted in
    /// _addCandidate function when candidate is
    /// already added to the CandidatesCollection
    error CandidateAlreadyInCollection();

    /// @notice CandidateAlreadyInList error is emitted in
    /// _promoteCandidate function when candidate is
    /// already in the CandidatesList
    error CandidateAlreadyInList();

    /// @notice CandidateNonExistent error is emitted in
    /// _downvoteCandidate, _upvoteCandidate, _promoteCandidate
    /// functions when candidate has not been added to the
    /// CandidatesCollection
    error CandidateNonExistent();

    /// @notice PromotionNotAllowed error is emitted in
    /// _promoteCandidate function when the candidate's
    /// score is less then or equal to 0
    error PromotionNotAllowed();

    uint256 private immutable MAX_LIST_SIZE;

    struct Candidate {
        int256 score;
        address author;
        bool exists;
    }

    // CandidatesCollection
    mapping(uint256 => Candidate) internal collection;
    // CandidatesList
    StructuredLinkedList.List internal list;

    constructor(uint256 listSize) {
        MAX_LIST_SIZE = listSize;
    }

    function getValue(uint256 _id) public view override returns (uint256) {
        return uint256(collection[_id].score);
    }

    function _addCandidate(uint256 id) internal {
        if (collection[id].exists) revert CandidateAlreadyInCollection();
        collection[id] = Candidate(0, msg.sender, true);
    }

    function _downvoteCandidate(uint256 id, uint256 votingPower) internal {
        // 1. candidate stays in the list after vote
        // 2. candidate is kicked out from the list
        // 3. candidate stays outside the list
        if (!collection[id].exists) revert CandidateNonExistent();

        int256 afterVote = collection[id].score - int256(votingPower);

        if (list.nodeExists(id)) {
            list.remove(id); // remove from old position
            if (afterVote > _getWorstScoreList()) {
                uint256 spot = list.getSortedSpot(
                    address(this),
                    uint256(afterVote)
                );
                list.insertBefore(spot, id);
            } else if (afterVote > 0) {
                list.pushFront(id);
            }
        }
        collection[id].score = afterVote;
    }

    function _promoteCandidate(uint256 id) internal {
        if (!collection[id].exists) revert CandidateNonExistent();
        if (list.nodeExists(id)) revert CandidateAlreadyInList();
        int256 score = collection[id].score;
        if (score < 0) revert PromotionNotAllowed();
        if (list.sizeOf() < MAX_LIST_SIZE) {
            uint256 spot = list.getSortedSpot(address(this), uint256(score));
            list.insertBefore(spot, id);
        }
    }

    function _upvoteCandidate(uint256 id, uint256 votingPower) internal {
        // 1. candidate already in the list or list size < MAX_LIST_SIZE
        // 2. candidate promoted to the list
        // 3. candidate stays outside the list
        if (!collection[id].exists) revert CandidateNonExistent();

        int256 afterVote = collection[id].score + int256(votingPower);

        if (list.nodeExists(id) || list.sizeOf() < MAX_LIST_SIZE) {
            list.remove(id); // remove from old position
            uint256 spot = list.getSortedSpot(
                address(this),
                uint256(afterVote)
            ); // calculate spot
            collection[id].score = afterVote;
            list.insertBefore(spot, id);
        } else if (afterVote > _getWorstScoreList()) {
            list.popFront();
            uint256 spot = list.getSortedSpot(
                address(this),
                uint256(afterVote)
            );
            collection[id].score = afterVote;
            list.insertBefore(spot, id);
        } else {
            collection[id].score = afterVote;
        }
    }

    function _getListSize() internal view returns (uint256) {
        return list.sizeOf();
    }

    function _getWorstScoreList() internal view returns (int256) {
        (, uint256 id) = list.getAdjacent(0, true);
        return collection[id].score;
    }

    function _isCandidateInCollection(uint256 id) internal view returns (bool) {
        return collection[id].exists;
    }

    function _isCandidateInList(uint256 id) internal view returns (bool) {
        return list.nodeExists(id);
    }

    function _getTopCandidatesInfo(
        uint256 size
    ) internal view returns (CandidateExternal[] memory c) {
        c = new CandidateExternal[](size);
        uint256 next;
        for (uint256 i = 0; i < size; i++) {
            (, next) = list.getAdjacent(next, false);
            c[i] = CandidateExternal({
                id: next,
                keyword: _decodeKeyword(next),
                score: collection[next].score,
                author: collection[next].author
            });
        }
        return c;
    }

    function _getTopCandidates(
        uint256 size
    ) internal view returns (uint256[] memory c) {
        c = new uint256[](size);
        uint256 next;
        for (uint256 i = 0; i < size; i++) {
            (, next) = list.getAdjacent(next, false);
            c[i] = next;
        }
        return c;
    }
}
