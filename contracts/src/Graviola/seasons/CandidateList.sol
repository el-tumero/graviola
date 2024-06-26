// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library CandidateList {
    
    struct Group{
        uint256 min;
        uint256 max;
        uint256 count;
    }

    struct CandidateInfo{
        int256 votes;
        bool exists;
    }

    struct List {
        Group common;
        Group uncommon;
        Group limited;
        mapping(uint256=>CandidateInfo) candidatesInfo;
        uint256[] candidates;
    }

    function add(List storage list, uint256 id) internal {
        list.candidates.push(id);
        list.candidatesInfo[id].exists = true;
    }

}