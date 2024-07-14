// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IGraviolaSeasonsArchive.sol";

contract GraviolaSeasonsArchive is Ownable, IGraviolaSeasonsArchive {
    constructor(address owner) Ownable(owner) {}

    uint16 wellSize = 100; // how many words can be added to single season's well
    uint8 expLen = 8; // how many words expire after season

    uint8 constant totalRarityGroups = 5;

    enum Rarity {
        COMMON,
        UNCOMMON,
        RARE,
        VERY_RARE,
        LEGENDARY
    }

    mapping(string => bool) private expiredWords;
    mapping(string => bool) private usedWords;
    mapping(uint256 => Season) private seasons;

    uint256 private currentSeasonId;
    uint8[totalRarityGroups] wordsPerRarityGroup = [77, 15, 5, 2, 1];

    function nameSeason(
        uint256 seasonId,
        string calldata name
    ) external onlyOwner {
        seasons[seasonId].name = name;
    }

    function nextSeason() external onlyOwner {
        ++currentSeasonId;
    }

    function getSeason(uint256 seasonId) external view returns (Season memory) {
        return seasons[seasonId];
    }

    function getCurrentSeasonId() external view returns (uint256) {
        return currentSeasonId;
    }

    function addWordToSeason(
        uint seasonId,
        string calldata word
    ) external onlyOwner {
        Season storage season = seasons[seasonId];
        require(season.well.length < wellSize);
        season.well.push(word);
        if (season.well.length <= expLen) expiredWords[word] = true;
        else usedWords[word] = true;
    }

    function isWordExpired(string calldata word) external view returns (bool) {
        return expiredWords[word];
    }

    function isWordUsed(string calldata word) external view returns (bool) {
        return usedWords[word];
    }

    function getWordsPerRarityGroup()
        external
        view
        returns (uint8[totalRarityGroups] memory)
    {
        return wordsPerRarityGroup;
    }

    function setWellSize(uint16 size) external onlyOwner {
        wellSize = size;
    }

    function setExpLen(uint8 len) external onlyOwner {
        expLen = len;
    }
}
