// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/math/Math.sol";

/// @notice Contract for rolling Graviola tokens and all logic related to keywords
contract GraviolaWell {

    // Internal Word structure
    struct Word {
        string keyword;
        uint count;
    }

    // A group represents an object containing everything related to a rarity level
    struct RarityGroup {
        string name;
        uint rarityPerc;
        Word[] keywords;
    }

    mapping (uint => RarityGroup) rarities;
    uint256 public constant KEYWORDS_PER_TOKEN = 3; // How many keywords should determine the token's description (result)
    uint256 public constant KEYWORDS_PER_TRADE_UP = 3; // How many tokens are needed to perform a Trade Up
    event RollResult(string result, uint256 rarityPerc);

    
    constructor() {
        // Common RarityGroup
        RarityGroup storage commons = rarities[0];
        commons.name = "Common";
        commons.rarityPerc = 66;
        commons.keywords.push(Word("human", 100));
        commons.keywords.push(Word("android", 100));
        commons.keywords.push(Word("robot", 100));
        commons.keywords.push(Word("cyborg", 100));
        commons.keywords.push(Word("droid", 100));

        // Uncommon RarityGroup
        RarityGroup storage uncommons = rarities[1];
        uncommons.name = "Uncommon";
        uncommons.rarityPerc = 20;
        uncommons.keywords.push(Word("elf", 100));
        uncommons.keywords.push(Word("goblin", 100));
        uncommons.keywords.push(Word("gnome", 100));

        // Rare RarityGroup
        RarityGroup storage rares = rarities[2];
        rares.name = "Rare";
        rares.rarityPerc = 9;
        rares.keywords.push(Word("nomad", 100));
        rares.keywords.push(Word("assassin", 100));
        rares.keywords.push(Word("agent", 100));

        // Very Rare RarityGroup
        RarityGroup storage veryRares = rarities[3];
        veryRares.name = "Very Rare";
        veryRares.rarityPerc = 4;
        veryRares.keywords.push(Word("hunter", 100));
        veryRares.keywords.push(Word("berserker", 100));
        veryRares.keywords.push(Word("mage", 100));

        // Legendary RarityGroup
        RarityGroup storage legendaries = rarities[4];
        legendaries.name = "Legendary";
        legendaries.rarityPerc = 1;
        legendaries.keywords.push(Word("graviola", 10));
        legendaries.keywords.push(Word("golden", 10));
        legendaries.keywords.push(Word("god", 1));
    }

    /// @notice Convert a fraction to basis points uint256
    function fractionToBasisPoints(
        uint256 numerator,
        uint256 denumerator
    ) internal pure returns (uint256) {
        return (numerator * 100) / denumerator;
    }

    // /// @notice Find the keyword (index in WELL_OF_WORDS) from integer
    // function findNearestWordRangeIndex(
    //     uint256 _number
    // ) public view returns (uint256) {
    //     require(_number < WELL_OF_WORDS_TOTAL_R);
    //     uint256 low = 0;
    //     uint256 high = WELL_OF_WORDS.length;
    //     while (low < high) {
    //         uint256 mid = Math.average(low, high);
    //         if (WELL_OF_WORDS[mid].upperRange > _number) {
    //             high = mid;
    //         } else {
    //             low = mid + 1;
    //         }
    //     }
    //     if (low > 0 && WELL_OF_WORDS[low - 1].upperRange == _number) {
    //         return low - 1;
    //     } else {
    //         return low;
    //     }
    // }

    /// @notice Roll 3 random keywords based on VRF (used for Token generation later)
    function rollWords(
        uint256 _seed
    ) public view returns (string memory, uint256, uint256) {

    }
}
