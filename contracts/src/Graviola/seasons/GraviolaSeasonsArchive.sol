// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GraviolaSeasonsArchive is Ownable{

    constructor(address owner) Ownable(owner){}
    
    enum Rarity{ COMMON, UNCOMMON, RARE, VERY_RARE, LEGENDARY }

    struct WordDetails {
        Rarity rarity;
        bool expired;
    }


    struct Season {
        string name;
        string[] well; // TODO: soon will be struct or array of structs
    }

  

    mapping(string=>WordDetails) private words;
    mapping(uint256=>Season) private seasons;

    uint256 private currentSeasonId;
    
    function nameSeason(uint seasonId, string calldata name) external onlyOwner {
        seasons[seasonId].name = name;
    }

    function switchSeason() external onlyOwner {
        ++currentSeasonId;
    }

    function addWordToSeason(uint seasonId, string calldata word) external onlyOwner {
        // seasons[seasonId].well.push(word);

    }

    function checkWordDetails(string calldata word) external view returns (WordDetails memory) {
        return words[word];
    }
}