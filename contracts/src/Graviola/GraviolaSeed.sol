// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IGraviolaSeasonsArchive} from "./seasons/archive/IGraviolaSeasonsArchive.sol";

contract GraviolaSeed {
    IGraviolaSeasonsArchive internal archive;

    // How many words are drawed for prompt creation
    uint8 internal KEYWORDS_PER_TOKEN = 3;
    uint256 internal DEFAULT_OMEGA = 100;

    /// @notice Create GraviolaSeed module
    /// @param archiveAddress GraviolaSeasonsArchive address
    constructor(address archiveAddress) {
        archive = IGraviolaSeasonsArchive(archiveAddress);
    }

    /// @notice Convert a fraction to basis points (BP)
    function _fractionToBasisPoints(
        uint256 _numerator,
        uint256 _denumerator
    ) internal pure returns (uint256) {
        return (_numerator * 100) / _denumerator;
    }

    /// @notice Roll 3 random keywords (used for Token generation later)
    /// @param seed Random input seed
    /// @return keywords String of combined and separated result keywords
    /// @return score // Weight sum of rolled groups' keywords. This determines the final token Rarity
    /// @return probability // Probability (in BP) of rolling the EXACT combination of rolled keywords (excluding order)
    function rollWords(
        uint256 seed,
        uint256 omega
    ) public view returns (string memory, uint256, uint256) {
        uint16 i = 0;
        uint16 j = 0;
        uint256 probability = 1;
        uint256 score = 0;
        int256[] memory used = new int256[](KEYWORDS_PER_TOKEN);
        string memory result = "";

        // Init 'used' arr
        for (uint256 x = 0; x < KEYWORDS_PER_TOKEN; x++) {
            used[x] = -1;
        }

        while (i < KEYWORDS_PER_TOKEN) {
            j++;
            uint256 randNum = uint256(keccak256(abi.encode(seed, i, j)));
            // Default omega is 100, so we're going to get an index in range 0-99 (inclusive)
            uint256 wordId = randNum % omega;

            // Duplicate id, re-roll
            if (
                used[0] == int256(wordId) ||
                used[1] == int256(wordId) ||
                used[2] == int256(wordId)
            ) {
                continue;
            }

            used[i] = int256(wordId);

            // Get group of rolled word
            uint256 groupId = archive.getRarityGroupById(wordId);
            // Get word count for the group with given id
            uint256 groupWordCount = archive.getWordsPerRarityGroup(groupId);

            probability *= _fractionToBasisPoints(
                groupWordCount,
                DEFAULT_OMEGA
            );
            score += archive.getRarityGroupWeight(groupId);

            result = string(
                abi.encodePacked(
                    result,
                    (i > 0 ? ", " : ""),
                    archive.getKeywordCurrentSeason(wordId)
                )
            );
            i++;
        }

        return (result, score, probability);
    }
}
