// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
// solhint-disable-next-line no-global-import
import "./IGraviolaSeasonsArchive.sol";

/// @title GraviolaSeasonsArchive
/// @notice Contract created for storing keywords and coordinating
/// Season logic
contract GraviolaSeasonsArchive is Ownable, IGraviolaSeasonsArchive {
    address private seasonsGovernorAddress;

    // How many words can be added to single season's well
    uint16 private constant WELL_SIZE = 100;
    // Number of rarity groups
    uint8 private constant TOTAL_RARITY_GROUPS = 5;
    // How many words expire after season
    uint8 private constant EXP_LEN = 8;

    // Stores info if word is expired or not
    mapping(string => bool) private expiredWords;
    // Stores info if word is used or not
    mapping(string => bool) private usedWords;
    // Stores Seasons
    mapping(uint256 => Season) private seasons;

    uint256 private currentSeasonId;

    // | RarityGroup | id | number of | keyword |
    // |             |    | keywords  | weight  |
    // |========================================|
    // | Common      | 0  | 77        | 1       |
    // | Uncommon    | 1  | 15        | 3       |
    // | Rare        | 2  | 5         | 5       |
    // | VeryRare    | 3  | 2         | 8       |
    // | Legendary   | 4  | 1         | 12      |

    // Two arrays bellow are filled with values corresponding to this table.

    // Represents how many words are assigned to specific group
    uint8[TOTAL_RARITY_GROUPS] private wordsPerRarityGroup = [77, 15, 5, 2, 1];

    // Represents weights of keywords assigned to specific group
    uint8[TOTAL_RARITY_GROUPS] private rarityGroupWeights = [1, 3, 5, 8, 12];

    constructor(address owner) Ownable(owner) {}

    modifier onlySeasonsGovernor() {
        if (seasonsGovernorAddress != msg.sender) {
            revert NotSeasonsGovernor();
        }
        _;
    }

    function setSeasonsGovernor(address seasonsGovernor) external onlyOwner {
        seasonsGovernorAddress = seasonsGovernor;
    }

    /// @notice Name the season with the given id
    /// @param seasonId id of the season
    /// @param name name for the season (e.g. Summer 2024)
    /// @dev Can be called only by the contract owner
    function nameSeason(
        uint256 seasonId,
        string calldata name
    ) external onlySeasonsGovernor {
        seasons[seasonId].name = name;
    }

    /// @notice Add prompt base to the season with the given id
    /// @param seasonId id of the season
    /// @param promptBase base of the prompt used in generation process
    /// @dev Can be called only by the contract owner
    function addPromptBaseToSeason(
        uint256 seasonId,
        string calldata promptBase
    ) external onlySeasonsGovernor {
        seasons[seasonId].promptBase = promptBase;
    }

    /// @notice Add keyword to the well of the season with the given id
    /// @param seasonId id of the season
    /// @param keyword string representation of a keyword
    /// @dev Emits WellFull() event on error
    /// @dev Can be called only by the contract owner
    function addKeywordToSeason(
        uint256 seasonId,
        string calldata keyword
    ) external onlySeasonsGovernor {
        Season storage season = seasons[seasonId];
        if (season.well.length > WELL_SIZE) {
            revert WellFull();
        }
        season.well.push(keyword);
        if (season.well.length <= EXP_LEN) expiredWords[keyword] = true;
        usedWords[keyword] = true;
    }

    /// @notice Start new seaons
    /// @dev Can be called only by the contract owner
    function nextSeason() external onlySeasonsGovernor {
        ++currentSeasonId;
    }

    /// @notice Return current seasons id
    function getCurrentSeasonId() external view returns (uint256) {
        return currentSeasonId;
    }

    /// @notice Return Season struct for the season with the given id
    /// @param seasonId id of the season
    function getSeason(uint256 seasonId) external view returns (Season memory) {
        return seasons[seasonId];
    }

    /// @notice Return name of the season with the given id
    /// @param seasonId id of the season
    function getSeasonName(
        uint256 seasonId
    ) external view override returns (string memory) {
        return seasons[seasonId].name;
    }

    /// @notice Return prompt base of the season with the given id
    /// @param seasonId id of the season
    function getSeasonPromptBase(
        uint256 seasonId
    ) external view override returns (string memory) {
        return seasons[seasonId].promptBase;
    }

    /// @notice Return true if the given keyword was used before
    /// keyword is treated as used if it was added to archive before
    /// @param keyword string representation of a keyword
    function isKeywordUsed(
        string calldata keyword
    ) external view returns (bool) {
        return usedWords[keyword];
    }

    // TODO: fix expired words logic
    /// @notice Return true if the given keyword was expired
    /// keyword is treated as expired if it was added to archive on
    /// 0-7 index postions (if keyword was legendary, very rare or rare)
    /// @param keyword string representation of a keyword
    function isKeywordExpired(
        string calldata keyword
    ) external view returns (bool) {
        return expiredWords[keyword];
    }

    /// @notice Return keyword with the given wordId from
    /// season with the given seasonId
    /// @param wordId id of the keyword inside the season's well
    /// @param seasonId id of the season
    function getKeyword(
        uint256 wordId,
        uint256 seasonId
    ) public view returns (string memory) {
        return seasons[seasonId].well[wordId];
    }

    function getKeywords(
        uint256 seasonId
    ) public view returns (string[] memory) {
        return seasons[seasonId].well;
    }

    /// @notice Return keyword with the given wordId from
    /// the current season
    /// @param wordId id of the keyword inside the season's well
    function getKeywordCurrentSeason(
        uint256 wordId
    ) external view returns (string memory) {
        return getKeyword(wordId, currentSeasonId);
    }

    function getKeywordsCurrentSeason()
        external
        view
        returns (string[] memory)
    {
        return getKeywords(currentSeasonId);
    }

    /// @notice Return rarity group id for the given wordId
    /// @param wordId id of the keyword inside the season's well
    function getRarityGroupById(
        uint256 wordId
    ) external view returns (uint256) {
        uint256 range;
        for (uint256 i = 0; i < TOTAL_RARITY_GROUPS; i++) {
            range += wordsPerRarityGroup[i];
            if (wordId < range) return i;
        }
        return TOTAL_RARITY_GROUPS - 1;
    }

    /// @notice Return rarity group id for the given wordId
    /// @param groupId id of the rarity group
    function getWordsPerRarityGroup(
        uint256 groupId
    ) external view returns (uint8) {
        return wordsPerRarityGroup[groupId];
    }

    /// @notice Return rarity group keyword weights for the
    /// group with the given id
    /// @param groupId id of the rarity group
    function getRarityGroupWeight(
        uint256 groupId
    ) external view returns (uint8) {
        return rarityGroupWeights[groupId];
    }

    /// @notice Return the number of keywords for each keyword group for all groups
    function getGroupSizes() external view returns (uint8[5] memory) {
        return wordsPerRarityGroup;
    }

    /// @notice Return all weights
    function getGroupWeights() external view returns (uint8[5] memory) {
        return rarityGroupWeights;
    }
}
