// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/math/Math.sol";

contract GraviolaWell {
    struct Word {
        string keyword;
        uint256 lowerRange;
        uint256 upperRange;
    }

    Word[] public WELL_OF_WORDS;
    uint256 public WELL_OF_WORDS_TOTAL_R = 2000;

    event RollResult(string result, uint256 rarity);

    constructor() {
        // Init base keywords and rarity factors

        // Simplified for probability testing

        WELL_OF_WORDS.push(Word("human", 0, 999));
        WELL_OF_WORDS.push(Word("elf", 1000, 1749));
        WELL_OF_WORDS.push(Word("goblin", 1750, 1949));
        WELL_OF_WORDS.push(Word("android", 1950, 1999));

        // WELL_OF_WORDS.push(Word("human", 1500));
        // WELL_OF_WORDS.push(Word("elf", 250));
        // WELL_OF_WORDS.push(Word("goblin", 150));
        // WELL_OF_WORDS.push(Word("android", 100));

        WELL_OF_WORDS.push(Word("human", 1500));
        WELL_OF_WORDS.push(Word("goblin", 200));
        WELL_OF_WORDS.push(Word("alien", 100));
        WELL_OF_WORDS.push(Word("elf", 50));
        WELL_OF_WORDS.push(Word("cyborg", 10));
        WELL_OF_WORDS.push(Word("android", 2));
        WELL_OF_WORDS.push(Word("mage", 50));
        WELL_OF_WORDS.push(Word("angry", 80));
        WELL_OF_WORDS.push(Word("stunned", 90));
        WELL_OF_WORDS.push(Word("monobrow", 1));
        WELL_OF_WORDS.push(Word("piercing", 20));
        WELL_OF_WORDS.push(Word("bald", 10));
        WELL_OF_WORDS.push(Word("tattoo", 30));
        WELL_OF_WORDS.push(Word("hairy", 5));
        WELL_OF_WORDS.push(Word("white", 200));
        WELL_OF_WORDS.push(Word("green", 200));
        WELL_OF_WORDS.push(Word("black", 200));
        WELL_OF_WORDS.push(Word("red", 200));
        WELL_OF_WORDS.push(Word("blue", 200));
        WELL_OF_WORDS.push(Word("yellow", 200));
    }

    function addWordToWell(string memory _keyword) public {
        // Reject if caller does not own at least one NFT
        // Keyword should be below 12? 16? characters
        // Roll rarity for new keyword using VRF
        // Create a Word struct
        // Push to WELL_OF_WORDS
    }


    // Converts a fraction to basis points uint256
    function fractionToBasisPoints(uint256 numerator, uint256 denumerator) internal pure returns (uint256) {
        return (numerator * 100) / denumerator;
    }

    function findNearestWordRangeIndex(
        uint256 _number
    ) public view returns (uint256) {
        require(_number < WELL_OF_WORDS_TOTAL_R);
        uint256 low = 0;
        uint256 high = WELL_OF_WORDS.length;
        while (low < high) {
            uint256 mid = Math.average(low, high);
            if (WELL_OF_WORDS[mid].upperRange > _number) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        if (low > 0 && WELL_OF_WORDS[low - 1].upperRange == _number) {
            return low - 1;
        } else {
            return low;
        }
    }

    function rollWords(uint256 _seed) external view returns (string memory, uint256) {
        uint8 keywordAmount = 3;
        uint256 totalProbability;
        string memory result = "";
        int256[3] memory usedRangeIndices = [int256(-1), -1, -1];
        uint256[3] memory bpProbabilities;
        uint256 dynamicRarity = WELL_OF_WORDS_TOTAL_R; // Dynamic rarity of each iteration

        uint256 i = 0;
        uint256 j = 0;

        while (i < keywordAmount) {

            j++;

            uint256 randomNum = uint256(
                keccak256(abi.encodePacked(_seed, uint256(i + j)))
            ) % WELL_OF_WORDS_TOTAL_R; // Random number between [0 and totalRarity]
            uint256 randomNumWordRangeIndex = findNearestWordRangeIndex(
                randomNum
            );

            // If we rolled a word (range) that has been already used -> roll again.
            if (
                (usedRangeIndices[0] == int256(randomNumWordRangeIndex)) ||
                (usedRangeIndices[1] == int256(randomNumWordRangeIndex)) ||
                (usedRangeIndices[2] == int256(randomNumWordRangeIndex))
            ) {
                continue;
            }

            // Calculate probability factor of selected keyword & subtract from total probability.
            uint256 selectedWordTotalRarity = WELL_OF_WORDS[
                randomNumWordRangeIndex
            ].upperRange - WELL_OF_WORDS[randomNumWordRangeIndex].lowerRange;

            bpProbabilities[i] = (fractionToBasisPoints(selectedWordTotalRarity, dynamicRarity));
            dynamicRarity -= selectedWordTotalRarity; // Update dynamic rarity

            // // Add selected word's range to usedRangeIndices to prevent duplicates.
            usedRangeIndices[i] = int256(randomNumWordRangeIndex);

            result = string(abi.encodePacked(result, (i > 0 ? ", " : ""), WELL_OF_WORDS[randomNumWordRangeIndex].keyword));
            
            i++;
        }

        totalProbability = (bpProbabilities[0] * bpProbabilities[1] * bpProbabilities[2]);
        return (result, totalProbability);

    }
}
