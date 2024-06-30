// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IGraviolaSeasonsArchive.sol";
import "./GraviolaSeasonsCandidates.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract GraviolaSeasonsGovernor is GraviolaSeasonsCandidates{

   

    error WrongWordFormat();
    error WordExpired();

    event NewCandidateAdded();
    event OldCandidate();

    IGraviolaSeasonsArchive immutable archive;

    
    constructor(address archiveAddress) GraviolaSeasonsCandidates(100){
        archive = IGraviolaSeasonsArchive(archiveAddress);
    }

    enum VotingState { PENDING, OPENED, CLOSED }
    
    struct Voting {
        uint256 startTimestamp;
        VotingState state;
    }

    uint256 private currentVotingId = 0;    
    mapping(uint256=>Voting) private votings;

        
    function validateWord(string memory str) private pure returns (bool) {
        bytes memory b = bytes(str);
        if(b.length > 20 || b.length == 0) return false;
        for (uint256 i = 0; i < b.length; i++) {
            uint8 char = uint8(b[i]);
            if(char < 97 || char > 122) return false;            
        }
        return true;
    }

    function addCandidate(uint256 word) external {
        string memory wordStr = Strings.toString(word);
        if (!validateWord(wordStr)) revert WrongWordFormat();
        // if(archive.isWordExpired(wordStr)) revert WordExpired();

        _addCandidate(word);
    }

    function upvoteCandidate(uint256 word, uint256 votes) external {
        // check used votes? (tokens?) 

        _upvoteCandidate(word, votes);
    }

    function downvoteCandidate(uint256 word, uint256 votes) external {
        // check used votes and so on
        _downvoteCandidate(word, votes);
    }

    function promoteCandidate(uint256 word) external {
        // anybody can promote -> since it's for rare situations 
        _promoteCandidate(word);
    }

    // learn ERC20 history?

    // == Getters ==

    function getCurrentVotingId() external view returns(uint256) {
        return currentVotingId;
    }

    function getVotingState(uint256 votingId) external view returns(VotingState) {
        return votings[votingId].state;
    }



}