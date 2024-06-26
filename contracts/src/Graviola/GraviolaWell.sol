// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/math/Math.sol";

/// @notice Contract for rolling Graviola tokens and all logic related to keywords
contract GraviolaWell {
    // RarityGroup is a collection of all keywords of one specific Rarity level.
    struct RarityGroup {
        string name;
        string[] keywords;
        uint256 startRange;
        uint256 endRange;
    }

    mapping(uint => RarityGroup) private rarities;
    uint256 public constant KEYWORDS_PER_TOKEN = 3;
    uint256 public constant TOKENS_PER_TRADE_UP = 3;
    // How many distinct Rarity Groups there are.
    // By default it's 5 (Common, Uncommon, Rare, Very Rare, Legendary).
    uint256 public constant UNIQUE_RARITY_GROUPS_COUNT = 5;
    event RollResult(string result, uint256 rarityPerc);
    event Log(string prefix, int val);

    // Having a 'setting' for a single Roll allows to modify
    // the probability distribution when performing a TradeUp.
    struct RarityGroupSetting {
        // Omega is the sum of all rarityGroupSizes.
        // Default = 100 (or more when in TradeUp mode)
        uint omega;
        // This determines 'how many keywords' there are, per group (ordered).
        // Default = uint[5] = [77, 15, 5, 2, 1]
        uint[UNIQUE_RARITY_GROUPS_COUNT] rarityGroupSizes;
    }

    RarityGroupSetting defaultRarityGroupSetting =
        RarityGroupSetting(100, [uint(77), 15, 5, 2, 1]);

    constructor() {
        // Init all keyword groups

        // Commons
        RarityGroup storage common = rarities[0];
        common.name = "Common";
        common.keywords = [
            "human",
            "android",
            "robot",
            "cyborg",
            "droid",
            "clone",
            "replicant",
            "simulant",
            "machina",
            "automa",
            "cybernetic",
            "bionic",
            "golem",
            "mechanoid",
            "synthetic",
            "hologram",
            "artificer",
            "servitor",
            "doppelganger",
            "mimic",
            "automaton",
            "construct",
            "program",
            "replica",
            "model",
            "drone",
            "entity",
            "avatar",
            "system",
            "framework",
            "unit",
            "figure",
            "template",
            "pattern",
            "layout",
            "format",
            "config",
            "blueprint",
            "prototype",
            "design",
            "machine",
            "device",
            "engine",
            "instrument",
            "gadget",
            "appliance",
            "tool",
            "apparatus",
            "mechanism",
            "gear",
            "module",
            "component",
            "part",
            "unit",
            "element",
            "piece",
            "subsystem",
            "framework",
            "structure",
            "architecture",
            "network",
            "grid",
            "mesh",
            "web",
            "framework",
            "infrastructure",
            "system",
            "circuit",
            "pathway",
            "channel",
            "conduit",
            "track",
            "route",
            "course",
            "line",
            "fire",
            "water"
        ];
        common.startRange = 0;
        common.endRange = 76;

        // Uncommons
        RarityGroup storage uncommon = rarities[1];
        uncommon.name = "Uncommon";
        uncommon.keywords = [
            "elf",
            "goblin",
            "gnome",
            "fairy",
            "troll",
            "sprite",
            "nymph",
            "imp",
            "dryad",
            "satyr",
            "hobbit",
            "leprechaun",
            "nomad",
            "assassin",
            "agent"
        ];
        uncommon.startRange = 77;
        uncommon.endRange = 91;

        // Rares
        RarityGroup storage rare = rarities[2];
        rare.name = "Rare";
        rare.keywords = ["mercenary", "spy", "hunter", "berserker", "mage"];
        rare.startRange = 92;
        rare.endRange = 96;

        // VeryRare
        RarityGroup storage veryRare = rarities[3];
        veryRare.name = "Very Rare";
        veryRare.keywords = ["shaman", "wizard"];
        veryRare.startRange = 97;
        veryRare.endRange = 98;

        // Legendary RarityGroup
        RarityGroup storage legendary = rarities[4];
        legendary.name = "Legendary";
        legendary.keywords = ["graviola"];
        legendary.startRange = 99;
        legendary.endRange = 99;
    }

    /// @notice Convert a fraction to basis points (BP)
    function fractionToBasisPoints(
        uint256 _numerator,
        uint256 _denumerator
    ) internal pure returns (uint256) {
        return (_numerator * 100) / _denumerator;
    }

    function getRarityGroupFromIdx(
        uint _idx,
        RarityGroupSetting memory _raritySetting
    ) public view returns (RarityGroup memory, uint) {
        require(
            _idx <= _raritySetting.omega && _idx >= 0,
            "Input out of bounds"
        );

        uint thresholdSum = 0;
        for (uint i = 0; i < UNIQUE_RARITY_GROUPS_COUNT; i++) {
            uint currentGroupRarityPerc = _raritySetting.rarityGroupSizes[i];
            if (_idx < thresholdSum + currentGroupRarityPerc) {
                RarityGroup storage currentGroup = rarities[i];
                return (currentGroup, i);
            }
            thresholdSum += currentGroupRarityPerc;
        }
        revert("Input does not match any rarity group");
    }


    /// @notice Get the relative (in bounds of RarityGroup's startRange and endRange) index of a keyword
    function getRelativeWordIdx(
        uint _absIdx,
        RarityGroup memory _rGroup
    ) public pure returns (uint) {
        // return uint(abs(int(_absIdx - _rGroup.endRange)));
        return uint(abs(int(_rGroup.endRange - _absIdx)));

    }

    /// @notice Util for getting relative group idx from absolute kword idx
    function abs(int x) private pure returns (int) {
        return x >= 0 ? x : -x;
    }

    /// @notice Util function for TradeUp - checks if all input Tokens are of the same Rarity level
    function raritiesInTheSameGroup(
        uint256[TOKENS_PER_TRADE_UP] memory _rarities
    ) internal view returns (bool, uint) {
        (, uint id) = getRarityGroupFromIdx(
            _rarities[0],
            defaultRarityGroupSetting
        );
        (, uint nextId) = getRarityGroupFromIdx(
            _rarities[1],
            defaultRarityGroupSetting
        );
        if (id != nextId) return (false, 0);
        (, nextId) = getRarityGroupFromIdx(
            _rarities[2],
            defaultRarityGroupSetting
        );
        if (id != nextId) return (false, 0);
        return (true, id);
    }

    /// @notice Roll 3 random keywords (used for Token generation later)
    /// @param _seed This should always 
    /// @return keywords String of combined result keywords
    /// @return probability The total probability (in BP) of getting the result Rarity groups
    /// @dev Classic implementation (non-TradeUp)
    function rollWords(
        uint256 _seed
    ) public view returns (string memory, uint256) {
        uint16 i = 0;
        uint16 j = 0;
        uint rollProbability = 1; // TODO: Fix this
        int[] memory used = new int[](3);
        string memory result = "";

        // Init 'used' arr
        for (uint x = 0; x < KEYWORDS_PER_TOKEN; x++) {
            used[x] = -1;
        }

        while (i < KEYWORDS_PER_TOKEN) {

            j++;
            uint randNum = uint256(keccak256(abi.encode(_seed, i, j)));
            // Default omega is 100, so we're going to get an index in range 0-99 (inclusive)
            uint randIdx = randNum % defaultRarityGroupSetting.omega;

            // Duplicate idx, re-roll
            if (used[0] == int(randIdx) ||
                used[1] == int(randIdx) ||
                used[2] == int(randIdx))
            {
                continue;
            }

            used[i] = int(randIdx);

            // Find group of rolled idx
            (RarityGroup memory rGroup,) = getRarityGroupFromIdx(randIdx, defaultRarityGroupSetting);
            // Calc the relative keyword idx inside the Rarity Group
            uint relIdx = getRelativeWordIdx(randIdx, rGroup);

            result = string(
                abi.encodePacked(
                    result,
                    (i > 0 ? ", " : ""),
                    rGroup.keywords[relIdx]
                )
            );
            i++;
        }

        return (result, rollProbability);
    }

    // /// @notice Roll 3 random keywords (used for Token generation later)
    // /// @dev TradeUp implementation (Custom RaritySetting)
    // function rollWords(
    //     uint256 _seed,
    //     RarityGroupSetting memory _customRaritySetting
    // ) public view returns (string memory, uint256, uint256) {
    //     uint16 i = 0;
    //     uint16 j = 0;
    //     int[KEYWORDS_PER_TOKEN][UNIQUE_RARITY_GROUPS_COUNT] memory usedIndices;
    //     uint256 rollProbability = 1;
    //     string memory result = "";
    //     RollData memory rollData;

    //     // Init usedIndices arr
    //     for (uint x = 0; x < RARITY_GROUPS_LENGTH; x++) {
    //         for (uint y = 0; y < KEYWORDS_PER_TOKEN; y++) {
    //             usedIndices[x][y] = -1;
    //         }
    //     }

    //     while (i < KEYWORDS_PER_TOKEN) {
    //         j++;

    //         uint256 randNum = uint256(keccak256(abi.encode(_seed, i, j)));

    //         // We only want to roll a group if we're not performing a re-roll in the current iteration
    //         if (!rollData.reroll) {
    //             // We only use the custom omega for rolling elements, but not for calculating the probability
    //             // Of the end result (group combinarion rarity stays the same)
    //             rollData.rolledGroup = randNum % _customRaritySetting.omega;
    //             // (Group object, uint groupId)
    //             (
    //                 rollData.selectedGroup,
    //                 rollData.selectedGroupId
    //             ) = findRarityGroupRange(
    //                 rollData.rolledGroup,
    //                 _customRaritySetting
    //             );
    //         }

    //         // ! We're calculating this step normally (using the default rarity setting)
    //         uint selectedGroupRarityPerc = defaultRarityGroupSetting
    //             .groupProbabilities[rollData.selectedGroupId];

    //         uint wordNum = randNum %
    //             getRarityGroupCount(rollData.selectedGroup);
    //         // wordId
    //         uint rolledWord = findWordFromRand(wordNum, rollData.selectedGroup);
    //         // Word object
    //         Word memory selectedWord = rollData.selectedGroup.keywords[
    //             rolledWord
    //         ];

    //         // Dup group + word = reroll
    //         if (
    //             usedIndices[rollData.selectedGroupId][0] ==
    //             int256(rolledWord) ||
    //             usedIndices[rollData.selectedGroupId][1] ==
    //             int256(rolledWord) ||
    //             usedIndices[rollData.selectedGroupId][2] == int256(rolledWord)
    //         ) {
    //             continue;
    //         }

    //         result = string(
    //             abi.encodePacked(
    //                 result,
    //                 (i > 0 ? ", " : ""),
    //                 selectedWord.keyword
    //             )
    //         );

    //         // Update probability
    //         rollProbability *= fractionToBasisPoints(
    //             selectedGroupRarityPerc,
    //             defaultRarityGroupSetting.omega
    //         );

    //         // Update dup filter arr
    //         usedIndices[rollData.selectedGroupId][i] = int256(rolledWord);

    //         // Shift groups bitmask to left
    //         rollData.uniqueGroupsBitmask |= (1 << rollData.selectedGroupId);

    //         i++;
    //     }

    //     uint256 uniqueGroupCount = popcount(rollData.uniqueGroupsBitmask);

    //     if (uniqueGroupCount == 3) {
    //         rollProbability *= 6;
    //     } else if (uniqueGroupCount == 2) {
    //         rollProbability *= 2;
    //     }

    //     return (result, rollProbability, j);
    // }

    // /// @notice The TradeUp mechanic allows the User to "trade" three NFTs of their choice for one of a better rarity
    // /// @notice All 3 input NFTs must be of the same rarity level in order to perform a successful TradeUp.
    // /// @param _tradeUpComponentsGroupId GroupId of caller tokens that they wish to trade up with
    // function _tradeUp(
    //     uint256 _seed,
    //     uint256 _tradeUpComponentsGroupId,
    //     uint256 _averageTokenRarity
    // ) public view returns (string memory, uint, uint) {
    //     // Calc target rarity group for the TradeUp
    //     uint256 currentRarityGroupId = _tradeUpComponentsGroupId;
    //     uint256 targetRarityGroupId = currentRarityGroupId + 1;

    //     // Calculate bonus and boost the group we're targeting
    //     uint targetGroupBonus = (2 **
    //         (UNIQUE_RARITY_GROUPS_COUNT - currentRarityGroupId)) +
    //         (_averageTokenRarity / 2);

    //     RarityGroupSetting memory tradeUpSetting = defaultRarityGroupSetting;
    //     tradeUpSetting.omega =
    //         defaultRarityGroupSetting.omega +
    //         targetGroupBonus;
    //     tradeUpSetting.groupProbabilities[
    //         targetRarityGroupId
    //     ] += targetGroupBonus;

    //     // Finally, roll with the TradeUp setting
    //     (string memory res, uint prob, uint j) = rollWords(
    //         _seed,
    //         tradeUpSetting
    //     );
    //     return (res, prob, j);
    // }
}
