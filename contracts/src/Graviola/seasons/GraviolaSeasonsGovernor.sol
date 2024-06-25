// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IGraviolaSeasonsArchive.sol";
import "./Sorter.sol";
import "./GraviolaSeasonsCandidates.sol";

import {StructuredLinkedList} from "solidity-linked-list/contracts/StructuredLinkedList.sol";
// import {VotingList} from "./VotingList.sol";

contract GraviolaSeasonsGovernor is GraviolaSeasonsCandidates{

   

    error WrongWordFormat();
    error WordExpired();

    event NewCandidateAdded();
    event OldCandidate();

    IGraviolaSeasonsArchive immutable archive;

    
    

    constructor(address archiveAddress){
        archive = IGraviolaSeasonsArchive(archiveAddress);
    }

    // struct Candidate {
    //     string word;
    //     int256 votes;
    // }

    enum VotingState { PENDING, OPENED, CLOSED }
    
    struct Voting {
        uint256 startTimestamp;
        VotingState state;
    }

    uint256 private currentVotingId = 0;    
    mapping(uint256=>Voting) private votings;

        



    // function validateWord(string calldata str) private pure returns (bool) {
    //     bytes memory b = bytes(str);
    //     if(b.length > 20 || b.length == 0) return false;
    //     for (uint256 i = 0; i < b.length; i++) {
    //         uint8 char = uint8(b[i]);
    //         if(char < 97 || char > 122) return false;            
    //     }
    //     return true;
    // }

    // function sort(Candidate[] memory arr) private pure returns (Candidate[] memory) {
    //     uint n = arr.length;
    //     for (uint i = 0; i < n - 1; i++) {
    //         for (uint j = 0; j < n - i - 1; j++) {
    //             if (arr[j].votes > arr[j + 1].votes) {
    //                 (arr[j], arr[j + 1]) = (arr[j + 1], arr[j]);
    //             }
    //         }
    //     }
    //     return arr;
    // }


    // function addCandidate(string calldata word) external {
    //     if (!validateWord(word)) revert WrongWordFormat();
    //     if(archive.isWordExpired(word)) revert WordExpired();

    //     Voting storage currentVoting = votings[currentVotingId];
    //     Candidate memory c = Candidate(word, 0);

    //     if(!currentVoting.nominated[word]) {
    //         if(archive.isWordUsed(word)) currentVoting.oldCandidates.push(c);
    //         else currentVoting.newCandidates.push(c);
    //         currentVoting.nominated[word] = true;
    //     }
    // }

    // function voteForNewCandidate(uint256 candidateId, uint256 votingPower, bool isUpvote) external {
    //     Voting storage currentVoting = votings[currentVotingId];
    //     if(isUpvote) currentVoting.newCandidates[candidateId].votes += int(votingPower);
    //     else currentVoting.newCandidates[candidateId].votes -= int(votingPower);
    // }

    // function voteForOldCandidate(uint256 candidateId, uint256 votingPower, bool isUpvote) external {
    //     Voting storage currentVoting = votings[currentVotingId];
    //     if(isUpvote) currentVoting.oldCandidates[candidateId].votes += int(votingPower);
    //     else currentVoting.oldCandidates[candidateId].votes -= int(votingPower);
    // }

    // == Getters ==

    function getCurrentVotingId() external view returns(uint256) {
        return currentVotingId;
    }

    function getVotingState(uint256 votingId) external view returns(VotingState) {
        return votings[votingId].state;
    }

    // function isVotingCandidate(string calldata word, uint256 votingId) external view returns (bool) {
    //     return votings[votingId].nominated[word];
    // } 

    // function getVotingCandidates(uint256 votingId) external view returns(Candidate[] memory, Candidate[] memory) {
    //     Voting storage voting = votings[votingId];
    //     return (voting.oldCandidates, voting.newCandidates);
    // }

}