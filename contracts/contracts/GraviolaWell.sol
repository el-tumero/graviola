// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/math/Math.sol";

/// @notice Contract for rolling Graviola tokens and all logic related to keywords
contract GraviolaWell {

    // Internal Word structure
    // Each Word has its rarity, calculated by: upperRange / lowerRange
    // The Word's rarity determines how likely it is to roll the keyword
    struct Word {
        string keyword;
        uint256 lowerRange;
        uint256 upperRange;
    }

    // Struct for displaying human-readable info about keywords
    // Used in frontend calls where Word ranges are useless, but percentages matter
    struct WordStats {
        string keyword;
        uint256 rarityPerc;
    }

    // This defines the rarity "levels" of keywords, e.g. a "Common" keyword
    // is anything between 100% and 25%, so the threshold would be 25
    struct WordRarity {
        string name;
        uint256 threshold;
    }

    Word[] public WELL_OF_WORDS;
    WordRarity[] public WORD_RARITY_SCALE;          // Sorted array of all keyword rarities' data
    mapping(string => uint256) internal wordMap;    // Give each keyword a unique id
    uint256 public WELL_OF_WORDS_MIN_R = 1;         // Minimum rarity for any keyword
    uint256 public WELL_OF_WORDS_TOTAL_R = 2021;    // Collective rarity of all (base + added by Users) keywords
                                                    // Base keywords = all Words included with the contract. Any keyword added by a User is not a base keyword
    uint256 public constant KEYWORDS_PER_TOKEN = 3; // How many keywords should determine the token's description (result)
    uint256 public constant KEYWORDS_PER_TRADE_UP = 3; // How many tokens are needed to perform a Trade Up
    event RollResult(string result, uint256 rarity);

    constructor() {

        // Init keyword rarity data
        WORD_RARITY_SCALE.push(WordRarity("Common", 25));
        WORD_RARITY_SCALE.push(WordRarity("Uncommon", 15));
        WORD_RARITY_SCALE.push(WordRarity("Rare", 8));
        WORD_RARITY_SCALE.push(WordRarity("Very Rare", 1));
        WORD_RARITY_SCALE.push(WordRarity("Legendary", 0));

        // Init base keywords and rarity factors
        WELL_OF_WORDS.push(Word("human", 0, 999));
        wordMap["human"] = 0;
        WELL_OF_WORDS.push(Word("goblin", 1000, 1249));
        wordMap["goblin"] = 1;
        WELL_OF_WORDS.push(Word("alien", 1250, 1749));
        wordMap["alien"] = 2;
        WELL_OF_WORDS.push(Word("elf", 1750, 1999));
        wordMap["elf"] = 3;
        WELL_OF_WORDS.push(Word("hairy", 2000, 2019));
        wordMap["hairy"] = 4;
        WELL_OF_WORDS.push(Word("monobrow", 2020, 2021));
        wordMap["monobrow"] = 5;

    }

    /// @notice Add a new keyword to the pool (well) of possible keywords.
    /// @notice The rarity of new keywords is chosen randomly.
    function addWordToWell(string memory _keyword, uint256 _seed) internal {

        // Keyword should be no longer than 12 characters
        require(bytes(_keyword).length <= 12 && bytes(_keyword).length > 0);

        // Generate a (pseudo) random probability for the new keyword
        uint256 rand = uint256(keccak256(abi.encodePacked(_seed, msg.sender))); // TODO: CHANGE THIS TO VRF
        // The range sum of new word should never be higher than 50% of Well's total rarity
        uint256 newWordRange = (rand % (WELL_OF_WORDS_TOTAL_R / 2)) + WELL_OF_WORDS_MIN_R;
        // Add new keyword's probability (range sum) to totalRarity
        WELL_OF_WORDS_TOTAL_R += newWordRange;

        // Calculate range bounds and push the new word to Well
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
    function calculateEstimatedWordRarityPerc(string memory _keyword) public view returns (uint256) {
        uint keywordRangeSum = WELL_OF_WORDS[wordMap[_keyword]].upperRange - WELL_OF_WORDS[wordMap[_keyword]].lowerRange;
        uint singleRollProbability = 10_000 - ((keywordRangeSum * 10_000) / WELL_OF_WORDS_TOTAL_R); // (1-P) operation; for greater division precision, the number 10_000 is used 
        uint totalRollProbability = singleRollProbability ** KEYWORDS_PER_TOKEN;                    // (1-P)^n
        return (1e12 - totalRollProbability) / 1e6;                                                 // 1 - (1-P)^n operation; 1e12 = (10_000)^3; 1e6 is used to decrease precision of the result
    }

    /// @notice Get WordRarity object from keyword probability
    /// @param _rarityBp Probability of the input keyword in a single roll (in BP)
    function getRarityDataFromBp(uint _rarityBp) public view returns (WordRarity memory) {
        uint _rarityPerc = _rarityBp / 10_000;
        for (uint i = 0; i < WORD_RARITY_SCALE.length; i++) {
            if (_rarityPerc >= WORD_RARITY_SCALE[i].threshold) {
                return WORD_RARITY_SCALE[i];
            }
        }
        return WORD_RARITY_SCALE[WORD_RARITY_SCALE.length - 1];
    }

    /// @notice Helper function for determining if a rarity (BP)
    /// @notice is within the target RarityLevel threshold (is of same RarityLevel or more rare than target)
    function isRareEnough(uint _rarityInBp, WordRarity memory _targetRarity) public pure returns (bool) {
        uint rarityPerc = _rarityInBp / 10_000;
        return rarityPerc < _targetRarity.threshold;
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

    /// @notice Find the keyword (index in WELL_OF_WORDS) from integer
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

    /// @notice Roll 3 random keywords based on VRF (used for Token generation later)
    function rollWords(
        uint256 _seed,
        bool _tradeUp
    ) public view returns (string memory, uint256, uint256) {

        uint256 rollProbability = 1;                     // Cumulative probability of all keywords in a single roll (in BP)
        uint256 rollTotalRarity = WELL_OF_WORDS_TOTAL_R; // Make a copy of totalRarity to keep track of relative probabilities
        string memory result = "";                       // Concatenated rolled keywords

        int256[KEYWORDS_PER_TOKEN] memory usedRangeIndices = [int256(-1), -1, -1];
        uint256[KEYWORDS_PER_TOKEN] memory bpProbabilities;

        uint256 i = 0;
        uint256 j = 0;

        while (i < KEYWORDS_PER_TOKEN) {
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
            ) % WELL_OF_WORDS_TOTAL_R; // Roll random number between [0 and totalRarity]
            uint256 randomNumWordRangeIndex = findNearestWordRangeIndex(
                randomNum
            );

            // If we rolled a word (integer in range) that has been already used, we roll again
            if (
                (usedRangeIndices[0] == int256(randomNumWordRangeIndex)) ||
                (usedRangeIndices[1] == int256(randomNumWordRangeIndex)) ||
                (usedRangeIndices[2] == int256(randomNumWordRangeIndex))
            ) {
                continue;
            }

            // Calculate probability factor of selected keyword & subtract from total probability
            uint256 selectedWordTotalRarity = WELL_OF_WORDS[
                randomNumWordRangeIndex
            ].upperRange - WELL_OF_WORDS[randomNumWordRangeIndex].lowerRange;

            bpProbabilities[i] = (
                fractionToBasisPoints(selectedWordTotalRarity, rollTotalRarity)
            );
            rollTotalRarity -= selectedWordTotalRarity; // Update dynamic rarity

            // Add selected word's index to usedRangeIndices (duplicate filter)
            usedRangeIndices[i] = int256(randomNumWordRangeIndex);

            result = string(
                abi.encodePacked(
                    result,
                    (i > 0 ? ", " : ""),
                    WELL_OF_WORDS[randomNumWordRangeIndex].keyword
                )
            );

            // Update rollProbability
            rollProbability *= bpProbabilities[i];
            
            // Check if we're in a Trade Up and if rerolls are needed
            if (_tradeUp && (bpProbabilities.length == 2)) {
                // Let's say we're Trading Up 3 Commons to an Uncommon
                WordRarity memory hardcodedTradeUpTargetRarity = WORD_RARITY_SCALE[0]; // RarityData for Common,
                // because we're using 3 Commons for this TradeUp
                bool tradeUpOK = isRareEnough(rollProbability, hardcodedTradeUpTargetRarity);
                if (!tradeUpOK) {
                    continue; // Roll again (not rare enough)
                }
            }

            i++;
        }

        return (result, rollProbability, j);
    }
}
