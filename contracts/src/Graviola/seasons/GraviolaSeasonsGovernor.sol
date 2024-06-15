// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IGraviolaSeasonsArchive.sol";
import "./Sorter.sol";

contract GraviolaSeasonsGovernor is Sorter{

    error WrongWordFormat();
    error WordExpired();

    IGraviolaSeasonsArchive immutable archive;

    constructor(address archiveAddress){
        archive = IGraviolaSeasonsArchive(archiveAddress);
    }

    uint256 private currentVotingId = 0;

    mapping(uint256=>Voting) private votings;

    struct Voting {
        mapping(string=>int256) votes;
        mapping(string=>bool) nominated;
        string[] oldCandidates;
        string[] newCandidates;
    }

    function isCandidate(string calldata word, uint256 votingId) external view returns (bool) {
        return votings[votingId].nominated[word];
    }


    function validateWord(string calldata str) private pure returns (bool) {
        bytes memory b = bytes(str);
        if(b.length > 20 || b.length == 0) return false;
        for (uint256 i = 0; i < b.length; i++) {
            uint8 char = uint8(b[i]);
            if(char < 97 || char > 122) return false;            
        }
        return true;
    }

    function voteForWord(string calldata word, uint256 votingPower, bool isUpvote) external {
        if (!validateWord(word)) revert WrongWordFormat();
        if(archive.isWordExpired(word)) revert WordExpired();
        
        Voting storage currentVoting = votings[currentVotingId];

        if(!currentVoting.nominated[word]) {
            if(archive.isWordUsed(word)) currentVoting.oldCandidates.push(word);
            else currentVoting.newCandidates.push(word);
            currentVoting.nominated[word] = true;
        }

        if(isUpvote) currentVoting.votes[word] = currentVoting.votes[word] + int256(votingPower); // TODO: check overflow
        else currentVoting.votes[word] = currentVoting.votes[word] - int256(votingPower);
    }   


    function getCurrentVotingId() external view returns(uint256) {
        return currentVotingId;
    }

    function getVotes(uint256 votingId) external view returns(string[] memory, int256[] memory) {
        
    }



}