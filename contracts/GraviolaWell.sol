// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract GraviolaWell {
    struct Word {
        string keyword;
        uint256 rarityFactor;
    }

    Word[] public WELL_OF_WORDS;

    event RollResult(string result, uint256 rarity);

    constructor() {
        // Init base keywords and rarity factors
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

    function rollWord(uint256 _seed) external {
        uint8 keywordAmount = 3;
        uint256 totalRarity = 0;
        string memory result;
        uint256 rarityProbability = 1e18; // Start with a scaled value of 1

        // Normalize rarity factors
        for (uint256 i = 0; i < WELL_OF_WORDS.length; i++) {
            totalRarity += WELL_OF_WORDS[i].rarityFactor;
        }

        // Get 3 random numbers and select words
        for (uint256 i = 0; i < keywordAmount; i++) {
            uint256 randomSeed = uint256(keccak256(abi.encode(_seed, i)));
            uint256 randomNumber = randomSeed % totalRarity;
            uint256 cumulatedRarity = 0;

            for (uint256 j = 0; j < WELL_OF_WORDS.length; j++) {
                cumulatedRarity += WELL_OF_WORDS[j].rarityFactor;
                if (randomNumber < cumulatedRarity) {
                    // Append selected word to result string
                    result = string(
                        abi.encodePacked(result, WELL_OF_WORDS[j].keyword, " ")
                    );
                    // Update rarity probability
                    rarityProbability =
                        (rarityProbability * WELL_OF_WORDS[j].rarityFactor) /
                        totalRarity;
                    break;
                }
            }
        }

        // Convert the scaled rarityProbability to a percentage
        uint256 rarityVal = rarityProbability / 1e13; // Max val = 10000 (100%)
        // Percentage = rarityVal / 100, prec = 2f

        // Emit the result and rarity as a percentage
        emit RollResult(result, rarityVal);
    }
}
