// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IGraviolaSeasonsArchive} from "./seasons/IGraviolaSeasonsArchive.sol";

contract GraviolaSeed {
    IGraviolaSeasonsArchive internal archive;

    uint8 KEYWORDS_PER_TOKEN = 3;

    constructor(address archiveAddress) {
        archive = IGraviolaSeasonsArchive(archiveAddress);
    }

    /// @notice Convert a fraction to basis points (BP)
    function fractionToBasisPoints(
        uint256 _numerator,
        uint256 _denumerator
    ) internal pure returns (uint256) {
        return (_numerator * 100) / _denumerator;
    }

    /// @notice Roll 3 random keywords (used for Token generation later)
    /// @param seed Random input seed
    /// @return keywords String of combined and separated result keywords
    /// @return weightSum       // Weight sum of rolled groups (keywords). This determines the final Rarity level
    /// @return totalProbability // Probability (in BP) of rolling the EXACT combination of rolled keywords (excluding order)
    /// @dev Classic implementation (non-TradeUp)
    function rollWords(
        uint256 seed
    ) public view returns (string memory, uint256, uint256) {
        uint16 i = 0;
        uint16 j = 0;
        uint totalProbability = 1;
        uint weightSum = 0;
        int[] memory used = new int[](KEYWORDS_PER_TOKEN);
        string memory result = "";

        // Init 'used' arr
        for (uint256 x = 0; x < KEYWORDS_PER_TOKEN; x++) {
            used[x] = -1;
        }

        while (i < KEYWORDS_PER_TOKEN) {
            j++;
            uint256 randNum = uint256(keccak256(abi.encode(seed, i, j)));
            // Default omega is 100, so we're going to get an index in range 0-99 (inclusive)
            uint256 omega = archive.getWellSize();
            uint256 wordId = randNum % omega;

            // Duplicate id, re-roll
            if (
                used[0] == int(wordId) ||
                used[1] == int(wordId) ||
                used[2] == int(wordId)
            ) {
                continue;
            }

            used[i] = int(wordId);

            // Get group of rolled word
            uint256 groupId = archive.getRarityGroupById(wordId);
            // Get word count for the group with given id
            uint256 groupWordCount = archive.getWordsPerRarityGroup(groupId);

            totalProbability *= fractionToBasisPoints(groupWordCount, omega);
            weightSum += archive.getRarityGroupWeight(groupId);

            result = string(
                abi.encodePacked(
                    result,
                    (i > 0 ? ", " : ""),
                    archive.getWordCurrentSeason(wordId)
                )
            );
            i++;
        }

        return (result, weightSum, totalProbability);
    }
}
