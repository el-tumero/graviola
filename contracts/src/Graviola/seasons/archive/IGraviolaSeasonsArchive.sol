// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IGraviolaSeasonsArchive {
    /// @notice Struct represeting Season
    struct Season {
        string name;
        string promptBase;
        string[] well;
    }

    /// @notice WellFull error is emmited if season's well is full
    /// during addKeywordToSeasons function execution
    error WellFull();

    error NotSeasonsGovernor();

    function setSeasonsGovernor(address seasonsGovernor) external;

    // **************************************************
    // Setters for Season logic
    // **************************************************
    function nameSeason(uint256 seasonId, string calldata name) external;

    function addPromptBaseToSeason(
        uint256 seasonId,
        string calldata promptBase
    ) external;

    function addKeywordToSeason(
        uint256 seasonId,
        string calldata keyword
    ) external;

    function nextSeason() external;

    // **************************************************
    // Getters for Season logic
    // **************************************************
    function getCurrentSeasonId() external view returns (uint256);

    function getSeason(uint256 seasonId) external view returns (Season memory);

    function getSeasonName(
        uint256 seasonId
    ) external view returns (string memory);

    function getSeasonPromptBase(
        uint256 seasonId
    ) external view returns (string memory);

    // **************************************************
    // Getters for keyword logic
    // **************************************************
    function isKeywordUsed(
        string calldata keyword
    ) external view returns (bool);

    function isKeywordExpired(
        string calldata keyword
    ) external view returns (bool);

    function getKeyword(
        uint256 wordId,
        uint256 seasonId
    ) external view returns (string memory);

    function getKeywordCurrentSeason(
        uint256 wordId
    ) external view returns (string memory);

    function getRarityGroupById(uint256 wordId) external view returns (uint256);

    function getWordsPerRarityGroup(
        uint256 groupId
    ) external view returns (uint8);

    function getRarityGroupWeight(
        uint256 groupId
    ) external view returns (uint8);
}
