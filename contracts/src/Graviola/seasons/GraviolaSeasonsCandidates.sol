// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {StructuredLinkedList, IStructureInterface} from "solidity-linked-list/contracts/StructuredLinkedList.sol";
import {CandidateExternal} from "./IGraviolaSeasonsGovernor.sol";


contract GraviolaSeasonsCandidates is IStructureInterface {
    using StructuredLinkedList for StructuredLinkedList.List;

    error CandidateAlreadyAdded();
    error CandidateAlreadyInList();
    error CandidateNonExistent();
    error PromotionNotAllowed();
    error VoteNotAllowed(uint256 code);
    error NegativeScore();

    uint256 immutable MAX_LIST_SIZE;

    struct Candidate {
        int256 score;
        address author;
        bool exists;
    }

    StructuredLinkedList.List internal list;
    mapping(uint256 => Candidate) internal candidates;

    constructor(uint256 listSize) {
        MAX_LIST_SIZE = listSize;
    }

    function getValue(uint256 _id) public view override returns (uint256) {
        int256 score = candidates[_id].score;
        if (score < 0) revert NegativeScore();
        return uint256(score);
    }

    function _addCandidate(uint256 id) internal {
        if (candidates[id].exists) revert CandidateAlreadyAdded();
        candidates[id] = Candidate(0, msg.sender, true);
    }

    function _downvoteCandidate(uint256 id, uint256 votingPower) internal {
        // 1. candidate stays in the list after vote
        // 2. candidate is kicked out from the list
        // 3. candidate stays outside the list
        if (!candidates[id].exists) revert CandidateNonExistent();

        int afterVote = candidates[id].score - int256(votingPower);

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
        candidates[id].score = afterVote;
    }

    function _promoteCandidate(uint256 id) internal {
        if (!candidates[id].exists) revert CandidateNonExistent();
        if (list.nodeExists(id)) revert CandidateAlreadyInList();
        int256 score = candidates[id].score;
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
        if (!candidates[id].exists) revert CandidateNonExistent();

        int afterVote = candidates[id].score + int256(votingPower);

        if (list.nodeExists(id) || list.sizeOf() < MAX_LIST_SIZE) {
            list.remove(id); // remove from old position
            uint256 spot = list.getSortedSpot(
                address(this),
                uint256(afterVote)
            ); // calculate spot
            candidates[id].score = afterVote;
            list.insertBefore(spot, id);
        } else if (afterVote > _getWorstScoreList()) {
            list.popFront();
            uint256 spot = list.getSortedSpot(
                address(this),
                uint256(afterVote)
            );
            candidates[id].score = afterVote;
            list.insertBefore(spot, id);
        } else {
            candidates[id].score = afterVote;
        }
    }

    function _getListSize() internal view returns (uint256) {
        return list.sizeOf();
    }

    function _getWorstScoreList() internal view returns (int256) {
        (, uint256 id) = list.getAdjacent(0, true);
        return candidates[id].score;
    }

    function _isCandidateExist(uint256 id) internal view returns (bool) {
        return list.nodeExists(id);
    }

    function _getTopCandidatesInfo(
        uint256 size
    ) internal view returns (CandidateExternal[] memory c) {
        c = new CandidateExternal[](size);
        uint256 next;
        for (uint i = 0; i < size; i++) {
            (, next) = list.getAdjacent(next, false);
            c[i] = CandidateExternal(
                next,
                candidates[next].score,
                candidates[next].author
            );
        }
    }

    function _getTopCandidates(
        uint256 size
    ) internal view returns (uint256[] memory c) {
        c = new uint256[](size);
        uint256 next;
        for (uint i = 0; i < size; i++) {
            (, next) = list.getAdjacent(next, false);
            c[i] = next;
        }
    }
}
