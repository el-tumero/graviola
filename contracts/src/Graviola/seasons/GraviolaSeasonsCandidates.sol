// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {StructuredLinkedList, IStructureInterface} from "solidity-linked-list/contracts/StructuredLinkedList.sol";

contract GraviolaSeasonsCandidates is IStructureInterface {
    using StructuredLinkedList for StructuredLinkedList.List;

    error CandidateAlreadyAdded();
    error CandidateNonExistent();
    
    StructuredLinkedList.List internal list;
    mapping(uint256=>uint256) internal votes;


    function getValue(uint256 _id) external view override returns (uint256) {
        return votes[_id]; 
    }

    function addCandidate(uint256 id, uint256 votingPower) external {
        if(list.nodeExists(id)) revert CandidateAlreadyAdded();
        if(list.sizeOf() == 0) {
            votes[id] = votingPower;
            list.pushBack(id);
            return;
        }
        uint256 spot = list.getSortedSpot(address(this), votes[id] + votingPower);
        votes[id] += votingPower;
        list.insertBefore(spot, id);

    }

    // function voteForCandidateNoMove(uint256 id, uint256 votingPower) external {
    //     (bool isExising, uint256 prev, uint256 next)= list.getNode(id);
    //     if(!isExising) revert CandidateNonExistent();
    //     // if()

    // }

    function voteForCandidate(uint256 id, uint256 votingPower) external {
        list.remove(id); // remove from old pos
        uint256 spot = list.getSortedSpot(address(this), votes[id] + votingPower); // calculate spot
        votes[id] += votingPower; // add votes
        list.insertBefore(spot, id); // insert in the right place
    }

    function getCandidate(uint256 id) external view returns(bool) {
        return list.nodeExists(id);
    }

    function getCandidates() external view returns (uint256[] memory candidates) {
        candidates = new uint256[](list.sizeOf());
        uint256 next;
        for (uint i = 0; i < list.sizeOf(); i++) {
            (, next) = list.getAdjacent(next, false);
            candidates[i] = next;
        }

    }
}