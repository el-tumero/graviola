// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/math/Math.sol";

/// @notice Contract for rolling Graviola tokens and all logic related to keywords
contract GraviolaWell {

    // Internal Word structure
    struct Word {
        string keyword;
        uint lowerRange;
        uint upperRange;
    }

    // A group represents an object containing everything related to a rarity level
    struct RarityGroup {
        string name;
        uint rarityPerc; // The probability of the entire group, e.g. 75% for Common
        Word[] keywords; // All keywords that belong to the group
    }

    mapping (uint => RarityGroup) rarities;
    uint256 public constant KEYWORDS_PER_TOKEN = 3;    // How many keywords should determine the token's description (result)
    uint256 public constant KEYWORDS_PER_TRADE_UP = 3; // How many tokens are needed to perform a Trade Up
    uint256 public constant RARITY_GROUPS_LENGTH = 5;  // How many distinct rarity groups
    uint256 public constant RARITY_GROUP_MAX_PROBABILITY = 100; // Basically just 100%
    event RollResult(string result, uint256 rarityPerc);

    
    constructor() {
        // Common RarityGroup
        RarityGroup storage commons = rarities[0];
        commons.name = "Common";
        commons.rarityPerc = 66;
        commons.keywords.push(Word("human", 0, 99));
        commons.keywords.push(Word("android", 100, 199));
        commons.keywords.push(Word("robot", 200, 299));
        // commons.keywords.push(Word("cyborg", 300, 399));
        // commons.keywords.push(Word("droid", 100));

        // Uncommon RarityGroup
        RarityGroup storage uncommons = rarities[1];
        uncommons.name = "Uncommon";
        uncommons.rarityPerc = 20;
        uncommons.keywords.push(Word("elf", 0, 99));
        uncommons.keywords.push(Word("goblin", 100, 199));
        uncommons.keywords.push(Word("gnome", 200, 299));

        // Rare RarityGroup
        RarityGroup storage rares = rarities[2];
        rares.name = "Rare";
        rares.rarityPerc = 9;
        rares.keywords.push(Word("nomad", 0, 99));
        rares.keywords.push(Word("assassin", 100, 199));
        rares.keywords.push(Word("agent", 200, 299));

        // Very Rare RarityGroup
        RarityGroup storage veryRares = rarities[3];
        veryRares.name = "Very Rare";
        veryRares.rarityPerc = 4;
        veryRares.keywords.push(Word("hunter", 0, 99));
        veryRares.keywords.push(Word("berserker", 100, 199));
        veryRares.keywords.push(Word("mage", 200, 299));

        // Legendary RarityGroup
        RarityGroup storage legendaries = rarities[4];
        legendaries.name = "Legendary";
        legendaries.rarityPerc = 1;
        legendaries.keywords.push(Word("graviola", 0, 9));
        legendaries.keywords.push(Word("golden", 10, 19));
        legendaries.keywords.push(Word("god", 20, 21));
    }

    /// @notice Convert a fraction to basis points uint256
    function fractionToBasisPoints(
        uint256 numerator,
        uint256 denumerator
    ) internal pure returns (uint256) {
        return (numerator * 100) / denumerator;
    }

    /// @notice Get sum of all keywords' count in a rarity group
    function getRarityGroupCount(RarityGroup memory _rGroup) private pure returns (uint) {
        return _rGroup.keywords[_rGroup.keywords.length - 1].upperRange;
    }

    /// @notice Get real count of a keyword in a group
    function getWordCount(uint _keywordId, RarityGroup memory _rGroup) private pure returns (uint) {
        return _rGroup.keywords[_keywordId].upperRange - _rGroup.keywords[_keywordId].lowerRange;
    }

    /// @notice Get RarityGroup object from a percentage input based on the group's threshold
    /// @param _percInput Uint in range 0-100. E.g: 80 => Common, 5 => Rare
    /// @return Rarity Group (if found) and index of group in the rarities mapping
    function findRarityGroupRange(uint _percInput) public view returns (RarityGroup memory, uint) {
        require(_percInput <= 100 && _percInput >= 0, "Input must be between 0 and 100");
        uint cumulativeThreshold = 0;
        for (uint i = RARITY_GROUPS_LENGTH; i > 0; i--) {
            RarityGroup storage currentGroup = rarities[i - 1];
            if (_percInput <= cumulativeThreshold + currentGroup.rarityPerc) {
                return (currentGroup, (i-1));
            }
            cumulativeThreshold += currentGroup.rarityPerc;
        }
        revert("Input does not match any rarity group");
    }

    /// @notice After rolling a random number in the range of a group, find the rolled word by ranges
    /// @notice Returns index of word in the scope of its group
    function findWordFromRand(uint _randNum, RarityGroup memory _targetGroup) public pure returns (uint) {
        // Searched number must be within the group's keyword bounds
        require(_randNum > 0 && _randNum <= getRarityGroupCount(_targetGroup), "Input is out of bounds for the specified group.");
        for (uint i = 0; i < _targetGroup.keywords.length; i++) {
            if (_randNum <= _targetGroup.keywords[i].upperRange ) {
                return i;
            }
        }
        revert("Input does not match any word in group");
    }

    /// @notice Calculate probabilirt of rolling the specified keyword in a group in a single roll
    function getWordProbability(uint _keywordIndex, RarityGroup memory _targetGroup) public pure returns (uint) {
        require(_targetGroup.keywords.length >= _keywordIndex, "Keyword index out of bounds");
        uint targetWordCount = getWordCount(_keywordIndex, _targetGroup);
        uint totalGroupCount = getRarityGroupCount(_targetGroup);
        return fractionToBasisPoints(targetWordCount, totalGroupCount);
    }

    /// @notice Roll 3 random keywords based on VRF (used for Token generation later)
    function rollWords(
        uint256 _seed
    ) public view returns (string memory, uint256, uint256) {
        
        uint16 i = 0;
        uint16 j = 0;
        int [KEYWORDS_PER_TOKEN][RARITY_GROUPS_LENGTH] memory usedIndices;       
        uint256 rollProbability = 1;
        string memory result = "";

        // Init usedIndices arr
        for (uint x = 0; x < RARITY_GROUPS_LENGTH; x++) {
            for (uint y = 0; y < KEYWORDS_PER_TOKEN; y++) {
                usedIndices[x][y] = -1;
            }
        }
       
        while (i < KEYWORDS_PER_TOKEN) {
            j++;

            uint256 randNum = uint256(keccak256(abi.encode(_seed, i, j)));

            uint rolledGroup = randNum % RARITY_GROUP_MAX_PROBABILITY;
            (RarityGroup memory selectedGroup, uint selectedGroupId) = findRarityGroupRange(rolledGroup);

            uint wordNum = randNum % getRarityGroupCount(selectedGroup);
            uint rolledWord = findWordFromRand(wordNum, selectedGroup);

            Word memory selectedWord = selectedGroup.keywords[rolledWord];

            // Dup group + word = reroll
            if (usedIndices[selectedGroupId][0] == int256(rolledWord) ||
                usedIndices[selectedGroupId][1] == int256(rolledWord) ||
                usedIndices[selectedGroupId][2] == int256(rolledWord))
            {
                continue;
            }

            result = string(
                abi.encodePacked(
                    result,
                    (i > 0 ? ", " : ""),
                    selectedWord.keyword
                )
            );

            // Update probability
            rollProbability *= fractionToBasisPoints(selectedGroup.rarityPerc, RARITY_GROUP_MAX_PROBABILITY);

            // Update dup filter arr
            usedIndices[selectedGroupId][i] = int256(rolledWord);

            i++;
        }

        return (result, rollProbability, j);

    }
}
