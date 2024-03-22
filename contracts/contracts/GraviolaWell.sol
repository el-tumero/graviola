// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "hardhat/console.sol";


/// @notice Contract for rolling Graviola tokens and all logic related to keywords
contract GraviolaWell {

    // Internal Word structure
    struct Word {
        string keyword;
        uint lowerRange;
        uint upperRange; // upperRange - lowerRange = "count" of a keyword
                         // The count is used to calculate the probability of getting a certain keyword
    }

    // A group represents an object containing everything related to a rarity level
    struct RarityGroup {
        string name;
        uint rarityPerc; // The probability of the entire group (Frontend only)
        Word[] keywords; // All keywords that belong to the group
    }

    // All data related to a single roll of n keywords
    struct RollData {
        RarityGroup selectedGroup;
        uint256 selectedGroupId;
        uint256 rolledGroup;         // Num between 0 and raritySetting.omega
        uint256 uniqueGroupsBitmask; // Bitmask for group uniqueness check
        bool reroll;                 // Reroll group blocker
    }

    mapping (uint => RarityGroup) private rarities;
    uint256 public constant KEYWORDS_PER_TOKEN = 3;   // How many keywords should determine the token's description (result)
    uint256 public constant TOKENS_PER_TRADE_UP = 3;  // How many tokens are needed to perform a Trade Up
    uint256 public constant RARITY_GROUPS_LENGTH = 5; // How many distinct rarity groups
    event RollResult(string result, uint256 rarityPerc);

    // Custom setting allows to boost certain groups during a TradeUp call
    struct RarityGroupSetting {
        uint omega; // 100 on default, or more when in TradeUp
        uint[RARITY_GROUPS_LENGTH] groupProbabilities;
    }

    RarityGroupSetting defaultRarityGroupSetting = RarityGroupSetting(100, [uint(88), 6, 3, 2, 1]);

    constructor() {

        // Common RarityGroup
        RarityGroup storage commons = rarities[0];
        commons.name = "Common";
        commons.keywords.push(Word("human", 0, 99));
        commons.keywords.push(Word("android", 100, 199));
        commons.keywords.push(Word("robot", 200, 299));
        commons.keywords.push(Word("cyborg", 300, 399));
        commons.keywords.push(Word("droid", 400, 499));

        // Uncommon RarityGroup
        RarityGroup storage uncommons = rarities[1];
        uncommons.name = "Uncommon";
        uncommons.keywords.push(Word("elf", 0, 99));
        uncommons.keywords.push(Word("goblin", 100, 199));
        uncommons.keywords.push(Word("gnome", 200, 299));

        // Rare RarityGroup
        RarityGroup storage rares = rarities[2];
        rares.name = "Rare";
        rares.keywords.push(Word("nomad", 0, 99));
        rares.keywords.push(Word("assassin", 100, 199));
        rares.keywords.push(Word("agent", 200, 299));

        // Very Rare RarityGroup
        RarityGroup storage veryRares = rarities[3];
        veryRares.name = "Very Rare";
        veryRares.keywords.push(Word("hunter", 0, 99));
        veryRares.keywords.push(Word("berserker", 100, 199));
        veryRares.keywords.push(Word("mage", 200, 299));

        // Legendary RarityGroup
        RarityGroup storage legendaries = rarities[4];
        legendaries.name = "Legendary";
        legendaries.keywords.push(Word("graviola", 0, 9));
        legendaries.keywords.push(Word("golden", 10, 19));
        legendaries.keywords.push(Word("god", 20, 21));
    }

    /// @notice Count the number of set bits in an uint
    function popcount(uint256 n) internal pure returns (uint256) {
        uint256 count = 0;
        while (n != 0) {
            count += n & 1;
            n >>= 1;
        }
        return count;
    }

    /// @notice Convert a fraction to basis points (BP)
    function fractionToBasisPoints(
        uint256 numerator,
        uint256 denumerator
    ) internal pure returns (uint256) {
        return (numerator * 100) / denumerator;
    }

    /// @notice Get all rarities in a list (frontend)
    function getRarityGroups() public view returns (RarityGroup[RARITY_GROUPS_LENGTH] memory) {
        RarityGroup[RARITY_GROUPS_LENGTH] memory res;
        for (uint i = 0; i < RARITY_GROUPS_LENGTH; i++) {
            RarityGroup memory group = RarityGroup(
                rarities[i].name,
                defaultRarityGroupSetting.groupProbabilities[i],
                rarities[i].keywords
            );
            res[i] = group;
        }
        return res;
    }
    
    /// @notice Get sum of all keywords' count in a rarity group
    function getRarityGroupCount(RarityGroup memory _rGroup) private pure returns (uint) {
        return _rGroup.keywords[_rGroup.keywords.length - 1].upperRange;
    }

    /// @notice Get the count of a keyword in a rarity group
    function getWordCount(uint _keywordId, RarityGroup memory _rGroup) private pure returns (uint) {
        return _rGroup.keywords[_keywordId].upperRange - _rGroup.keywords[_keywordId].lowerRange;
    }

    /// @notice Get RarityGroup object from a percentage input based on the group's threshold
    /// @param _percInput Uint in range 0-100. E.g: 80 => Common, 5 => Rare
    /// @return Rarity Group (if found) and index of group in the rarities mapping
    function findRarityGroupRange(uint _percInput, RarityGroupSetting memory _raritySetting) public view returns (RarityGroup memory, uint) {
        require(_percInput <= _raritySetting.omega && _percInput >= 0, "Input out of bounds");
        uint cumulativeThreshold = 0;
        for (uint i = RARITY_GROUPS_LENGTH; i > 0; i--) {
            RarityGroup storage currentGroup = rarities[i - 1];
            uint currentGroupRarityPerc = _raritySetting.groupProbabilities[i - 1];
            if (_percInput <= cumulativeThreshold + currentGroupRarityPerc) {
                return (currentGroup, (i-1));
            }
            cumulativeThreshold += currentGroupRarityPerc;
        }
        revert("Input does not match any rarity group");
    }


    // temp name
    function raritiesInTheSameGroup(uint256[TOKENS_PER_TRADE_UP] memory _rarities) internal view returns(bool, uint) {
        (,uint id) = findRarityGroupRange(_rarities[0], defaultRarityGroupSetting);
        (,uint nextId) = findRarityGroupRange(_rarities[1], defaultRarityGroupSetting);
        if(id != nextId) return (false, 0);
        (,nextId) = findRarityGroupRange(_rarities[2], defaultRarityGroupSetting);
        if(id != nextId) return (false, 0);
        return (true, id);
    }

    /// @notice After rolling a random number in the range of a group, find the rolled word by ranges
    /// @return Index of word in the scope of its group
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
    /// @return Probability of getting the keyword in perc. format
    function getWordProbability(uint _keywordIndex, RarityGroup memory _targetGroup) public pure returns (uint) {
        require(_targetGroup.keywords.length >= _keywordIndex, "Keyword index out of bounds");
        uint targetWordCount = getWordCount(_keywordIndex, _targetGroup);
        uint totalGroupCount = getRarityGroupCount(_targetGroup);
        return fractionToBasisPoints(targetWordCount, totalGroupCount);
    }

    /// @notice Roll 3 random keywords (used for Token generation later)
    /// @dev Classic implementation (non-TradeUp)
    function rollWords(uint256 _seed) public view returns (string memory, uint256, uint256) {
        
        uint16 i = 0;
        uint16 j = 0;
        uint256 rollProbability = 1;
        int256 [KEYWORDS_PER_TOKEN][RARITY_GROUPS_LENGTH] memory usedIndices;
        string memory result = "";
        RollData memory rollData;

        // // Init usedIndices arr
        for (uint x = 0; x < RARITY_GROUPS_LENGTH; x++) {
            for (uint y = 0; y < KEYWORDS_PER_TOKEN; y++) {
                usedIndices[x][y] = -1;
            }
        }
       
        while (i < KEYWORDS_PER_TOKEN) {
            j++;

            uint256 randNum = uint256(keccak256(abi.encode(_seed, i, j)));
            
            // We only want to roll a group if we're not performing a re-roll in the current iteration
            if (!rollData.reroll) {
                rollData.rolledGroup = randNum % defaultRarityGroupSetting.omega;
                // (Group object, uint groupId)
                (rollData.selectedGroup, rollData.selectedGroupId) = findRarityGroupRange(rollData.rolledGroup, defaultRarityGroupSetting);
            }

            uint selectedGroupRarityPerc = defaultRarityGroupSetting.groupProbabilities[rollData.selectedGroupId];
            uint wordNum = randNum % getRarityGroupCount(rollData.selectedGroup);
           
            // wordId
            uint rolledWord = findWordFromRand(wordNum, rollData.selectedGroup);
            // Word object
            Word memory selectedWord = rollData.selectedGroup.keywords[rolledWord];

            // Dup group + word = reroll
            if (usedIndices[rollData.selectedGroupId][0] == int256(rolledWord) ||
                usedIndices[rollData.selectedGroupId][1] == int256(rolledWord) ||
                usedIndices[rollData.selectedGroupId][2] == int256(rolledWord)) {
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
            rollProbability *= fractionToBasisPoints(selectedGroupRarityPerc, defaultRarityGroupSetting.omega);
            // Update dup filter arr
            usedIndices[rollData.selectedGroupId][i] = int256(rolledWord);
            // Shift groups bitmask to left
            rollData.uniqueGroupsBitmask |= (1 << rollData.selectedGroupId);

            i++;
        }

        uint256 uniqueGroupCount = popcount(rollData.uniqueGroupsBitmask);

        if (uniqueGroupCount == 3) {
            rollProbability *= 6;
        } else if (uniqueGroupCount == 2) {
            rollProbability *= 2;
        }

        return (result, rollProbability, j);
    }

    /// @notice Roll 3 random keywords (used for Token generation later)
    /// @dev TradeUp implementation (Custom RaritySetting)
    function rollWords(
        uint256 _seed,
        RarityGroupSetting memory _customRaritySetting
    ) public view returns (string memory, uint256, uint256) {
        
        uint16 i = 0;
        uint16 j = 0;
        int [KEYWORDS_PER_TOKEN][RARITY_GROUPS_LENGTH] memory usedIndices;       
        uint256 rollProbability = 1;
        string memory result = "";
        RollData memory rollData;

        // Init usedIndices arr
        for (uint x = 0; x < RARITY_GROUPS_LENGTH; x++) {
            for (uint y = 0; y < KEYWORDS_PER_TOKEN; y++) {
                usedIndices[x][y] = -1;
            }
        }
       
        while (i < KEYWORDS_PER_TOKEN) {
            j++;

            uint256 randNum = uint256(keccak256(abi.encode(_seed, i, j)));

            // We only want to roll a group if we're not performing a re-roll in the current iteration
            if (!rollData.reroll) {
                // We only use the custom omega for rolling elements, but not for calculating the probability
                // Of the end result (group combinarion rarity stays the same)
                rollData.rolledGroup = randNum % _customRaritySetting.omega;
                // (Group object, uint groupId) 
                (rollData.selectedGroup, rollData.selectedGroupId) = findRarityGroupRange(rollData.rolledGroup, _customRaritySetting);
            }

            // ! We're calculating this step normally (using the default rarity setting)
            uint selectedGroupRarityPerc = defaultRarityGroupSetting.groupProbabilities[rollData.selectedGroupId];

            uint wordNum = randNum % getRarityGroupCount(rollData.selectedGroup);
            // wordId
            uint rolledWord = findWordFromRand(wordNum, rollData.selectedGroup);
            // Word object
            Word memory selectedWord = rollData.selectedGroup.keywords[rolledWord];

            // Dup group + word = reroll
            if (usedIndices[rollData.selectedGroupId][0] == int256(rolledWord) ||
                usedIndices[rollData.selectedGroupId][1] == int256(rolledWord) ||
                usedIndices[rollData.selectedGroupId][2] == int256(rolledWord)) {
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
            rollProbability *= fractionToBasisPoints(selectedGroupRarityPerc, defaultRarityGroupSetting.omega);

            // Update dup filter arr
            usedIndices[rollData.selectedGroupId][i] = int256(rolledWord);

            // Shift groups bitmask to left
            rollData.uniqueGroupsBitmask |= (1 << rollData.selectedGroupId);


            i++;
        }

        uint256 uniqueGroupCount = popcount(rollData.uniqueGroupsBitmask);

        if (uniqueGroupCount == 3) {
            rollProbability *= 6;
        } else if (uniqueGroupCount == 2) {
            rollProbability *= 2;
        }

        return (result, rollProbability, j);
    }

    /// @notice The TradeUp mechanic allows the User to "trade" three NFTs of their choice for one of a better rarity
    /// @notice All 3 input NFTs must be of the same rarity level in order to perform a successful TradeUp.
    /// @param _tradeUpComponentsGroupId GroupId of caller tokens that they wish to trade up with 
    function _tradeUp(uint256 _seed, uint256 _tradeUpComponentsGroupId, uint256 _averageTokenRarity) view public returns (string memory, uint, uint) {
        console.log(_tradeUpComponentsGroupId);
        console.log(_averageTokenRarity);

        // Calc target rarity group for the TradeUp
        uint256 currentRarityGroupId = _tradeUpComponentsGroupId;
        uint256 targetRarityGroupId = currentRarityGroupId + 1;
        

        // Calculate bonus and boost the group we're targeting
        uint targetGroupBonus = (2 ** (RARITY_GROUPS_LENGTH - currentRarityGroupId)) + (_averageTokenRarity/2); 

        // console.log(targetGroupBonus); 
        
        RarityGroupSetting memory tradeUpSetting = defaultRarityGroupSetting;
        tradeUpSetting.omega = defaultRarityGroupSetting.omega + targetGroupBonus;
        tradeUpSetting.groupProbabilities[targetRarityGroupId] += targetGroupBonus;


        // Finally, roll with the TradeUp setting
        (string memory res, uint prob, uint j) = rollWords(_seed, tradeUpSetting);
        return (res, prob, j);
    }


}
