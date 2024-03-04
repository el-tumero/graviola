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
        // WELL_OF_WORDS.push(Word("goblin", 200));
        // WELL_OF_WORDS.push(Word("alien", 100));
        // WELL_OF_WORDS.push(Word("elf", 50));
        // WELL_OF_WORDS.push(Word("cyborg", 10));
        // WELL_OF_WORDS.push(Word("android", 2));
        // WELL_OF_WORDS.push(Word("mage", 50));
        // WELL_OF_WORDS.push(Word("angry", 80));
        // WELL_OF_WORDS.push(Word("stunned", 90));
        // WELL_OF_WORDS.push(Word("monobrow", 1));
        // WELL_OF_WORDS.push(Word("piercing", 20));
        // WELL_OF_WORDS.push(Word("bald", 10));
        // WELL_OF_WORDS.push(Word("tattoo", 30));
        // WELL_OF_WORDS.push(Word("hairy", 5));
        // WELL_OF_WORDS.push(Word("white", 200));
        // WELL_OF_WORDS.push(Word("green", 200));
        // WELL_OF_WORDS.push(Word("black", 200));
        // WELL_OF_WORDS.push(Word("red", 200));
        // WELL_OF_WORDS.push(Word("blue", 200));
        // WELL_OF_WORDS.push(Word("yellow", 200));
    }

    function addWordToWell(string memory _keyword) public {
        // Reject if caller does not own at least one NFT
        // Keyword should be below 12? 16? characters
        // Roll rarity for new keyword using VRF
        // Create a Word struct
        // Push to WELL_OF_WORDS
    }

    function findNearestWordRange(uint256 _number) public view returns (uint256) {
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

    // function 

    // function rollWords(uint256 _seed, uint256 _tokenId) external {

    //     uint8 keywordAmount = 3;
    //     string memory result = "";
    //     mapping(uint256 => bool) memory usedWordIndices;
    //     uint256 totalRarity = WELL_OF_WORDS_TOTAL_R;
    //     uint256[] usedWordProbabilities = [];

    //     for (uint256 i = 0; i < keywordAmount; i++) {

            

    //         uint256 r = uint256(keccak256(abi.encodePacked(_seed, uint256(1)))) % WELL_OF_WORDS.length;

    //         if (usedWordIndices[r] == true) {
    //             keywordAmount++;
    //             continue;
    //         }

    //         Word selectedWord = WELL_OF_WORDS[r];
    //         usedWordIndices[r] = true;

    //         // Add word probability and WoW's total probability for later
    //         usedWordProbabilities.push(selectedWord.rarityFactor);
    //         usedWordProbabilities.push(totalRarity);

    //         // Remove rarityFactor of just selected element from total
    //         totalRarity -= selectedWord.rarityFactor;
    //         result = string.concat(result, selectedWord.keyword + " ");

    //     }


        

    //     // Emit the result and the combined rarity factor
    //     emit RollResult(result, random);
    // }
}
