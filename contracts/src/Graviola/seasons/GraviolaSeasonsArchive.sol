// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
// solhint-disable-next-line no-global-import
import "./IGraviolaSeasonsArchive.sol";

contract GraviolaSeasonsArchive is Ownable, IGraviolaSeasonsArchive {
    constructor(address owner) Ownable(owner) {}

    uint16 private wellSize = 100; // how many words can be added to single season's well
    uint8 private expLen = 8; // how many words expire after season

    uint8 private constant TOTAL_RARITY_GROUPS = 5;

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
    uint8[TOTAL_RARITY_GROUPS] private wordsPerRarityGroup = [1, 2, 5, 15, 77];
    uint8[TOTAL_RARITY_GROUPS] private rarityGroupWeights = [12, 8, 5, 3, 1];

    // [77, 15, 5, 2, 1];
    // [1, 2, 5, 15, 77];

    function nameSeason(
        uint256 seasonId,
        string calldata name
    ) external onlyOwner {
        seasons[seasonId].name = name;
    }

    function addPromptBase(
        uint256 seasonId,
        string calldata promptBase
    ) external onlyOwner {
        seasons[seasonId].promptBase = promptBase;
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

    function getSeasonName(
        uint256 seasonId
    ) external view override returns (string memory) {
        return seasons[seasonId].name;
    }

    function getSeasonPromptBase(
        uint256 seasonId
    ) external view override returns (string memory) {
        return seasons[seasonId].promptBase;
    }

    function addWordToSeason(
        uint256 seasonId,
        string calldata word
    ) external onlyOwner {
        Season storage season = seasons[seasonId];
        if (season.well.length > wellSize) {
            revert WellFull();
        }
        season.well.push(word);
        if (season.well.length <= expLen) expiredWords[word] = true;
        usedWords[word] = true;
    }

    function isWordExpired(string calldata word) external view returns (bool) {
        return expiredWords[word];
    }

    function isWordUsed(string calldata word) external view returns (bool) {
        return usedWords[word];
    }

    function getRarityGroupById(uint256 id) external view returns (uint256) {
        uint256 range;
        for (uint256 i = 0; i < TOTAL_RARITY_GROUPS; i++) {
            range += wordsPerRarityGroup[i];
            if (id < range) return i;
        }
        return TOTAL_RARITY_GROUPS - 1;
    }

    function getWordsPerRarityGroup(
        uint256 groupId
    ) external view returns (uint8) {
        return wordsPerRarityGroup[groupId];
    }

    function getRarityGroupWeight(
        uint256 groupId
    ) external view returns (uint8) {
        return rarityGroupWeights[groupId];
    }

    function getWellSize() external view returns (uint256) {
        return wellSize;
    }

    function getWord(
        uint256 wordId,
        uint256 seasonId
    ) public view returns (string memory) {
        return seasons[seasonId].well[wordId];
    }

    function getWordCurrentSeason(
        uint256 wordId
    ) external view returns (string memory) {
        return getWord(wordId, currentSeasonId);
    }

    function setWellSize(uint16 size) external onlyOwner {
        wellSize = size;
    }

    function setExpLen(uint8 len) external onlyOwner {
        expLen = len;
    }
}
