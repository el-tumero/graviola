// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IGraviolaSeasonsArchive {
    struct Season {
        string name;
        string promptBase;
        string[] well;
    }

    error WellFull();

    function nameSeason(uint256 seasonId, string calldata name) external;

    function nextSeason() external;

    function addPromptBase(
        uint256 seasonId,
        string calldata promptBase
    ) external;

    function getSeason(uint256 seasonId) external view returns (Season memory);

    function getSeasonName(
        uint256 seasonId
    ) external view returns (string memory);

    function getSeasonPromptBase(
        uint256 seasonId
    ) external view returns (string memory);

    function getCurrentSeasonId() external view returns (uint256);

    function addWordToSeason(uint256 seasonId, string calldata word) external;

    function isWordUsed(string calldata word) external view returns (bool);

    function isWordExpired(string calldata word) external view returns (bool);

    function getWordsPerRarityGroup(
        uint256 groupId
    ) external view returns (uint8);

    function getRarityGroupWeight(
        uint256 groupId
    ) external view returns (uint8);

    function getRarityGroupById(uint256 id) external view returns (uint256);

    function getWellSize() external view returns (uint256);

    function getWord(
        uint256 wordId,
        uint256 seasonId
    ) external view returns (string memory);

    function getWordCurrentSeason(
        uint256 wordId
    ) external view returns (string memory);

    function setWellSize(uint16 size) external;

    function setExpLen(uint8 len) external;
}
