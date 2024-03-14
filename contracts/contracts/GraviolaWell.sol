// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/math/Math.sol";

contract GraviolaWell {
    // Internal Word structure
    struct Word {
        string keyword;
        uint256 lowerRange;
        uint256 upperRange;
    }

    // Struct for displaying human-readable info about keywords
    struct WordStats {
        string keyword;
        uint256 rarityPerc;
    }

    mapping(string => uint256) internal wordMap;
    Word[] public WELL_OF_WORDS;
    uint256 public WELL_OF_WORDS_MIN_R = 10; // Minimum rarity for any keyword
    uint256 public WELL_OF_WORDS_TOTAL_R = 2000; // Collective rarity of all keywords
    uint256 public KEYWORDS_PER_TOKEN = 3; // How many keywords should be used to roll and generate the image

    event RollResult(string result, uint256 rarity);

    constructor() {
        // Init base keywords and rarity factors
        // Simplified for probability testing

        WELL_OF_WORDS.push(Word("human", 0, 999));
        wordMap["human"] = 0;

        WELL_OF_WORDS.push(Word("goblin", 1000, 1249));
        wordMap["goblin"] = 1;

        WELL_OF_WORDS.push(Word("alien", 1250, 1749));
        wordMap["alien"] = 2;

        WELL_OF_WORDS.push(Word("elf", 1750, 1999));
        wordMap["elf"] = 3;

        // WELL_OF_WORDS.push(Word("human", 0, 999));
        // WELL_OF_WORDS.push(Word("elf", 1000, 1249));
        // WELL_OF_WORDS.push(Word("bald", 1250, 1349));
        WELL_OF_WORDS.push(Word("hairy", 2000, 2019));
        wordMap["hairy"] = 4;

        WELL_OF_WORDS.push(Word("monobrow", 2020, 2021));
        wordMap["monobrow"] = 5;
        
        // WELL_OF_WORDS.push(Word("tattoo", 1400, 1449));
        // WELL_OF_WORDS.push(Word("green", 1450, 1499));
        // WELL_OF_WORDS.push(Word("red", 1500, 1599));
        // WELL_OF_WORDS.push(Word("blue", 1600, 1749));
        // WELL_OF_WORDS.push(Word("goblin", 1750, 1949));
        // WELL_OF_WORDS.push(Word("android", 1950, 1999));
        // WELL_OF_WORDS.push(Word("cyborg", 2000, 2009));
        // WELL_OF_WORDS.push(Word("android", 2010, 2012));
        // WELL_OF_WORDS.push(Word("mage", 2013, 2062));
        // WELL_OF_WORDS.push(Word("angry", 2063, 2115));
        // WELL_OF_WORDS.push(Word("stunned", 2116, 2205));
        // WELL_OF_WORDS.push(Word("monobrow", 2206, 2207));

        // WELL_OF_WORDS.push(Word("human", 1500));
        // WELL_OF_WORDS.push(Word("elf", 250));
        // WELL_OF_WORDS.push(Word("goblin", 150));
        // WELL_OF_WORDS.push(Word("android", 100));

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

    /// @notice Add a new keyword to the pool (well) of possible keywords.
    /// @notice The rarity of new keywords is chosen randomly.
    function addWordToWell(string memory _keyword, uint256 _seed) public {
        // TODO: replace _seed with VRF call
        // Reject if caller does not own at least one NFT
        // Keyword should be no longer than 12 characters
        require(bytes(_keyword).length <= 12 && bytes(_keyword).length > 0);

        // Generate a (pseudorandom) probability for the new keyword
        uint256 rand = uint256(keccak256(abi.encodePacked(_seed, msg.sender))); // CHANGE THIS TO VRF
        uint256 newWordRange = ((rand %
            ((WELL_OF_WORDS_TOTAL_R - WELL_OF_WORDS_MIN_R) / 10 + 1)) * 10) +
            WELL_OF_WORDS_MIN_R;

        // Add probability sum to totalRarity
        WELL_OF_WORDS_TOTAL_R += newWordRange;

        Word memory currentLastWord = WELL_OF_WORDS[WELL_OF_WORDS.length - 1];
        uint256 newWordLowerRange = currentLastWord.upperRange + 1;
        uint256 newWordUpperRange = newWordLowerRange + newWordRange;

        Word memory newWord = Word(
            _keyword,
            newWordLowerRange,
            newWordUpperRange
        );
        wordMap[_keyword] = (WELL_OF_WORDS.length);
        WELL_OF_WORDS.push(newWord);
    }

    /// @notice We're estimating the word's probability with this equation: 1 - (1 - P)^n,
    /// @notice Where `P` is the probability of target keyword in a single keyword roll and `n` is the KEYWORDS_PER_TOKEN value.
    function calculateEstimatedWordRarityPerc(
        string memory _keyword
    ) public view returns (uint256) {
        uint rawKeywordRange = WELL_OF_WORDS[wordMap[_keyword]].upperRange -
            WELL_OF_WORDS[wordMap[_keyword]].lowerRange;
        uint maxProbabilityPerc = 100;
        uint maxProbabilityInBp = 1000000; // 100 perc in BP
        uint singleRollProbabilityInBP = maxProbabilityPerc -
            fractionToBasisPoints(rawKeywordRange, WELL_OF_WORDS_TOTAL_R);
        uint totalRollProbabilityInBP = singleRollProbabilityInBP **
            KEYWORDS_PER_TOKEN;
        uint res = maxProbabilityInBp - totalRollProbabilityInBP;
        return res;
    }

    function getWellOfWords() public view returns (Word[] memory) {
        return WELL_OF_WORDS;
    }

    function getAllWords() public view returns (WordStats[] memory) {
        WordStats[] memory res = new WordStats[](WELL_OF_WORDS.length);
        for (uint i = 0; i < WELL_OF_WORDS.length; i++) {
            Word memory word = WELL_OF_WORDS[i];
            uint prob = calculateEstimatedWordRarityPerc(word.keyword);
            WordStats memory wordStats = WordStats(word.keyword, prob);
            res[i] = wordStats;
        }
        return res;
    }

    /// @notice Convert a fraction to basis points uint256
    function fractionToBasisPoints(
        uint256 numerator,
        uint256 denumerator
    ) internal pure returns (uint256) {
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

    function rollWords(
        uint256 _seed
    ) public view returns (string memory, uint256) {
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
                keccak256(
                    abi.encodePacked(
                        _seed,
                        uint256(i + j),
                        msg.sender,
                        block.timestamp
                    )
                )
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

            bpProbabilities[i] = (
                fractionToBasisPoints(selectedWordTotalRarity, dynamicRarity)
            );
            dynamicRarity -= selectedWordTotalRarity; // Update dynamic rarity

            // // Add selected word's range to usedRangeIndices to prevent duplicates.
            usedRangeIndices[i] = int256(randomNumWordRangeIndex);

            result = string(
                abi.encodePacked(
                    result,
                    (i > 0 ? ", " : ""),
                    WELL_OF_WORDS[randomNumWordRangeIndex].keyword
                )
            );

            i++;
        }

        totalProbability = (bpProbabilities[0] *
            bpProbabilities[1] *
            bpProbabilities[2]);
        return (result, totalProbability);
    }
}
