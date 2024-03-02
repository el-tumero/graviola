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

        // Simplified for probability testing
        WELL_OF_WORDS.push(Word("human", 1500));
        WELL_OF_WORDS.push(Word("elf", 250));
        WELL_OF_WORDS.push(Word("goblin", 150));
        WELL_OF_WORDS.push(Word("android", 100));

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

    function rollWords(uint256 _seed) external {
        uint8 keywordAmount = 3;
        uint256 totalRarity = 0;
        string memory result = "";
        uint256 resultRarity = 1;

        // Sum rarity of all WELL_OF_WORDS items.
        for (uint256 i = 0; i < WELL_OF_WORDS.length; i++) {
            totalRarity += WELL_OF_WORDS[i].rarityFactor;
        }

        // Roll three keywords based on their probability.
        for (uint256 i = 0; i < keywordAmount; i++) {
            uint256 random = uint256(keccak256(abi.encodePacked(_seed, i))) %
                totalRarity;
            uint256 sum = 0;

            for (uint256 j = 0; j < WELL_OF_WORDS.length; j++) {
                sum += WELL_OF_WORDS[j].rarityFactor;
                if (random < sum) {
                    result = string(
                        abi.encodePacked(
                            result,
                            (i > 0 ? ", " : ""),
                            WELL_OF_WORDS[j].keyword
                        )
                    );
                    resultRarity *= WELL_OF_WORDS[j].rarityFactor;
                    break; // Aaaaaa let meout
                }
            }
        }

        // Calc probability of this roll
        // 100 000 = 100%, => (result probability / 100) = human-readable percnetage
        uint256 probability = (resultRarity * 100000) /
            totalRarity ** keywordAmount;

        // Emit the result and rarity as a percentage
        emit RollResult(result, probability);
    }
}
