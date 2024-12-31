// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IGraviolaSeasonsArchive} from "./seasons/archive/IGraviolaSeasonsArchive.sol";

contract GraviolaSeed {
    IGraviolaSeasonsArchive internal archive;

    // How many words are drawed for prompt creation
    uint8 internal constant KEYWORDS_PER_TOKEN = 3;
    uint256 internal constant DEFAULT_OMEGA = 100;

    /// @notice Create GraviolaSeed module
    /// @param archiveAddress GraviolaSeasonsArchive address
    constructor(address archiveAddress) {
        archive = IGraviolaSeasonsArchive(archiveAddress);
    }

    /// @notice Convert a fraction to basis points (BP)
    function _fractionToBasisPoints(
        uint256 numerator,
        uint256 denumerator
    ) internal pure returns (uint256) {
        return (numerator * 100) / denumerator;
    }

    /// @notice Roll 3 random keywords (used for Token generation later)
    /// @param seed Random input seed
    /// @return keywords String of combined and separated result keywords
    /// @return groups // Array of keyword groupIds. This determines the final token Rarity
    function rollWords(
        uint256 seed,
        uint256 omega
    ) public view returns (string memory, bytes memory) {
        uint256 i = 0;
        uint256 j = 0;

        uint256[3] memory used = [
            type(uint256).max,
            type(uint256).max,
            type(uint256).max
        ];

        bytes memory wordIds = new bytes(KEYWORDS_PER_TOKEN);

        string memory result = "";

        while (i < KEYWORDS_PER_TOKEN) {
            j++;
            uint256 randNum = uint256(keccak256(abi.encode(seed, i, j)));
            // Default omega is 100, so we're going to get an index in range 0-99 (inclusive)
            uint256 wordId = (DEFAULT_OMEGA - omega) + (randNum % omega);

            // Duplicate id, re-roll
            if (used[0] == wordId || used[1] == wordId || used[2] == wordId) {
                continue;
            }

            // Get group of rolled word
            used[i] = wordId;
            wordIds[i] = bytes1(uint8(wordId));

            result = string(
                abi.encodePacked(
                    result,
                    (i > 0 ? ", " : ""),
                    archive.getKeywordCurrentSeason(wordId)
                )
            );
            i++;
        }

        return (result, wordIds);
    }
}
