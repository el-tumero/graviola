// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IGraviolaSeasonsArchive {
    struct Season {
        string name;
        string[] well;
    }

    function nameSeason(uint256 seasonId, string calldata name) external;
    function nextSeason() external;
    function getSeason(uint256 seasonId) external view returns (Season memory);
    function getCurrentSeasonId() external view returns (uint256);
    function addWordToSeason(uint seasonId, string calldata word) external;
    function isWordUsed(string calldata word) external view returns (bool);
    function isWordExpired(string calldata word) external view returns (bool);
    function getWordsPerRarityGroup() external view returns (uint8[5] memory);
    function setWellSize(uint16 size) external;
    function setExpLen(uint8 len) external;
}
