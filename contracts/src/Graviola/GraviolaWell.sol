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
        uint256 weight; // Weight of this Group's keyword (one)
        uint256 minTokenWeight; // Weight sum needed to classify a Token to be of this Rarity
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
        common.weight = 1;
        common.minTokenWeight = 0;
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
            "element",
            "piece",
            "subsystem",
            "structure",
            "architecture",
            "network",
            "grid",
            "mesh",
            "web",
            "infrastructure",
            "circuit",
            "pathway",
            "channel",
            "conduit",
            "track",
            "route",
            "course",
            "line",
            "fire",
            "water",
            "matrix",
            "nexus",
            "interface",
            "controller"
        ];
        common.startRange = 0;
        common.endRange = 76;

        // Uncommons
        RarityGroup storage uncommon = rarities[1];
        uncommon.name = "Uncommon";
        uncommon.weight = 3;
        uncommon.minTokenWeight = 4;
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
        rare.weight = 5;
        rare.minTokenWeight = 11;
        rare.keywords = ["mercenary", "spy", "hunter", "berserker", "mage"];
        rare.startRange = 92;
        rare.endRange = 96;

        // VeryRare
        RarityGroup storage veryRare = rarities[3];
        veryRare.name = "Very Rare";
        veryRare.weight = 8;
        veryRare.minTokenWeight = 15;
        veryRare.keywords = ["shaman", "wizard"];
        veryRare.startRange = 97;
        veryRare.endRange = 98;

        // Legendary RarityGroup
        RarityGroup storage legendary = rarities[4];
        legendary.name = "Legendary";
        legendary.weight = 12;
        legendary.minTokenWeight = 20;
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

    /// @notice Get all rarities in a list (frontend)
    function getRarityGroups()
        public
        view
        returns (RarityGroup[UNIQUE_RARITY_GROUPS_COUNT] memory)
    {
        RarityGroup[UNIQUE_RARITY_GROUPS_COUNT] memory res;
        for (uint i = 0; i < UNIQUE_RARITY_GROUPS_COUNT; i++) {
            res[i] = rarities[i];
        }
        return res;
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

    /// @notice Get the relative (between RarityGroup's startRange and endRange) index of a keyword
    function getRelativeWordIdx(
        uint _absIdx,
        RarityGroup memory _rGroup
    ) public pure returns (uint) {
        return uint(abs(int(_rGroup.endRange - _absIdx)));
    }

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
    /// @param _seed Random input seed
    /// @return keywords String of combined and separated result keywords
    /// @return resWeight       // Weight sum of rolled groups (keywords). This determines the final Rarity level
    /// @return totalProbability // Probability (in BP) of rolling the EXACT combination of rolled keywords (excluding order)
    /// @dev Classic implementation (non-TradeUp)
    function rollWords(
        uint256 _seed
    ) public view returns (string memory, uint256, uint256) {
        uint16 i = 0;
        uint16 j = 0;
        uint totalProbability = 1;
        uint resWeight = 0;
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
            if (
                used[0] == int(randIdx) ||
                used[1] == int(randIdx) ||
                used[2] == int(randIdx)
            ) {
                continue;
            }

            used[i] = int(randIdx);

            // Find group of rolled idx
            (RarityGroup memory rGroup, ) = getRarityGroupFromIdx(
                randIdx,
                defaultRarityGroupSetting
            );
            // Calc the relative keyword idx inside the Rarity Group
            uint relIdx = getRelativeWordIdx(randIdx, rGroup);
            uint rGroupKwordCount = (rGroup.endRange - rGroup.startRange) + 1;
            totalProbability *= fractionToBasisPoints(
                rGroupKwordCount,
                defaultRarityGroupSetting.omega
            );
            resWeight += rGroup.weight;

            result = string(
                abi.encodePacked(
                    result,
                    (i > 0 ? ", " : ""),
                    rGroup.keywords[relIdx]
                )
            );
            i++;
        }

        return (result, resWeight, totalProbability);
    }

    /// @dev TradeUp implementation (Custom RaritySetting)
    function rollWords(
        uint256 _seed,
        RarityGroupSetting memory _customRaritySetting
    ) public view returns (string memory, uint256) {
        uint16 i = 0;
        uint16 j = 0;
        uint rollProbability = 1;
        int[] memory used = new int[](3);
        string memory result = "";

        // Init 'used' arr
        for (uint x = 0; x < KEYWORDS_PER_TOKEN; x++) {
            used[x] = -1;
        }

        while (i < KEYWORDS_PER_TOKEN) {
            j++;
            uint randNum = uint256(keccak256(abi.encode(_seed, i, j)));
            // We're going to get an index in range (0-_customSetting.omega)
            uint randIdx = randNum % _customRaritySetting.omega;

            // Duplicate idx, re-roll
            if (
                used[0] == int(randIdx) ||
                used[1] == int(randIdx) ||
                used[2] == int(randIdx)
            ) {
                continue;
            }

            used[i] = int(randIdx);

            // Find group of rolled idx
            (RarityGroup memory rGroup, ) = getRarityGroupFromIdx(
                randIdx,
                _customRaritySetting
            );
            // Calc the relative keyword idx inside the Rarity Group
            uint relIdx = getRelativeWordIdx(randIdx, rGroup);

            uint rGroupKwordCount = (rGroup.endRange - rGroup.startRange) + 1;
            rollProbability *= fractionToBasisPoints(
                rGroupKwordCount,
                _customRaritySetting.omega
            );

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

    /// @notice 'TradeUp' allows the User to 'trade' three Tokens of the same Rarity group for another (free) roll.
    /// During the TradeUp roll, one of the higher-rarity groups (than the ones being traded) is going to get a subtle,
    /// but significant probability boost. The probability boost works by duplicating keywords of higher Rarity
    /// and expanding the group's boundaries, which increases the chance of overall Rarity group occurrence.
    function _tradeUp(
        uint256 _seed,
        uint256 _inputRarityGroupId
    ) public view returns (string memory, uint) {

        memory RarityGroup inputGroup = rarities[_inputRarityGroupId];

        // // Finally, roll with the TradeUp setting
        // (string memory res, uint prob) = rollWords(
        //     _seed,
        //     tradeUpSetting
        // );
        // return (res, prob);
        return ("", 0);
    }
}
