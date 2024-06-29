// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {StructuredLinkedList, IStructureInterface} from "solidity-linked-list/contracts/StructuredLinkedList.sol";


contract GraviolaSeasonsCandidates is IStructureInterface {
    using StructuredLinkedList for StructuredLinkedList.List;


    error CandidateAlreadyAdded();
    error CandidateNonExistent();
    error VoteNotAllowed(uint256 code);
    error NegativeScore();

    uint256 constant MAX_LIST_SIZE = 5;

    struct Candidate {
        int256 score;
        address creator;
        bool exists;
    }
    
    StructuredLinkedList.List internal list;
    mapping(uint256=>Candidate) internal candidates;


    function getValue(uint256 _id) external view override returns (uint256) {
        int256 score = candidates[_id].score;
        if(score < 0) revert NegativeScore();
        return uint256(score);
    }

 
    function addCandidate(uint256 id) external {
        if(candidates[id].exists) revert CandidateAlreadyAdded();
        candidates[id] = Candidate(0, msg.sender, true);
    }

    function debugAddCandidate(uint256 id, uint256 votes) external {
        candidates[id] = Candidate(int256(votes), msg.sender, true);
        uint256 spot = list.getSortedSpot(address(this), votes);
        list.insertBefore(spot, id);
    }



    function debugGetNode(uint256 id) external view returns (bool, uint256, uint256) {
        return list.getNode(id);
    }

    function debugGetSortedSpot(uint256 value) external view returns(uint256) {
        return list.getSortedSpot(address(this), value);
    }

 

    function removeCandidate(uint256 id, uint256 votingPower) external {
        
    }
    
    function downvoteCandidate(uint256 id, uint256 votingPower) external {

    }


    function upvoteCandidate(uint256 id, uint256 votingPower) external {
        // 1. candidate already in the list or list size < MAX_LIST_SIZE
        // 2. candidate promoted to the list
        // 3. candidate stays outside the list
        if(!candidates[id].exists) revert CandidateNonExistent();

        int afterVote = candidates[id].score + int256(votingPower);


        if(list.nodeExists(id) || list.sizeOf() < MAX_LIST_SIZE){
            list.remove(id); // remove from old position
            uint256 spot = list.getSortedSpot(address(this), uint256(afterVote)); // calculate spot
            candidates[id].score = afterVote;
            list.insertBefore(spot, id);
        } else if(afterVote > getWorstScoreList()){
            list.popFront();
            uint256 spot = list.getSortedSpot(address(this), uint256(afterVote));
            candidates[id].score = afterVote;
            list.insertBefore(spot, id);
        } else {
            candidates[id].score = afterVote;
        }
    }

    function getListSize() external view returns (uint256) {
        return list.sizeOf();
    }

    function getHead() external view returns (bool, uint256){
        return list.getAdjacent(0, true);
    }

    function getTail() external view returns (bool, uint256){
        return list.getAdjacent(0, false);
    }

    function getWorstScoreList() public view returns (int256) {
        (,uint256 id) = list.getAdjacent(0, true);
        return candidates[id].score;
    }

    function isCandidateExist(uint256 id) external view returns(bool) {
        return list.nodeExists(id);
    }

    function getTopCandidates(uint256 size) external view returns (uint256[] memory c) {
        c = new uint256[](size);
        uint256 next;
        for (uint i = 0; i < size; i++) {
            (, next) = list.getAdjacent(next, false);
            c[i] = next;
        }
    }
}