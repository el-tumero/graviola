// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GraviolaGenerator} from "../Graviola/GraviolaGenerator.sol";
import {AIOracleMock} from "../OAO/AIOracleMock.sol";
import {GraviolaToken} from "../Graviola/GraviolaToken.sol";
import {GraviolaSeasonsArchive} from "../Graviola/seasons/archive/GraviolaSeasonsArchive.sol";
import {TGraviolaSeasonsGovernor} from "../Graviola/seasons/governor/TGraviolaSeasonsGovernor.sol";
import {VRFV2PlusWrapperMock} from "../utils/VRFV2PlusWrapperMock.sol";
import {GraviolaCollection} from "../Graviola/GraviolaCollection.sol";
import {KeywordConverter} from "../utils/KeywordConverter.sol";

abstract contract Migration is KeywordConverter {
    string internal constant DEFAULT_PROMPT_BASE =
        "Generate a minimalistic portrait of a fictional character. Use a solid color background. The main features of this character are: ";

    uint256 internal constant NUMBER_OF_KEYWORDS = 100;

    enum DeployedContract {
        VRF,
        OAO,
        TOKEN,
        COLLECTION,
        SEASONS_ARCHIVE,
        SEASONS_GOVERNOR,
        GENERATOR
    }

    mapping(DeployedContract => address) internal addresses;

    address internal migrator = address(this);

    VRFV2PlusWrapperMock internal vrf;
    AIOracleMock internal oao;
    GraviolaToken internal gt;
    GraviolaCollection internal collection;
    GraviolaSeasonsArchive internal gsa;
    TGraviolaSeasonsGovernor internal gsg;
    GraviolaGenerator internal generator;

    string[NUMBER_OF_KEYWORDS] internal keywords = [
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
        "controller",
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
        "agent",
        "mercenary",
        "spy",
        "hunter",
        "berserker",
        "mage",
        "shaman",
        "wizard",
        "graviola"
    ];

    function setup() external virtual {
        // ARCHIVE setup
        gsa.setSeasonsGovernor(migrator);

        gsa.nameSeason(0, "Summer 2024");
        gsa.addPromptBaseToSeason(0, DEFAULT_PROMPT_BASE);

        // fill season with keywords
        for (uint256 i = 0; i < NUMBER_OF_KEYWORDS; i++) {
            gsa.addKeywordToSeason(0, keywords[i]);
        }

        gsa.setSeasonsGovernor(address(gsg));

        // GOVERNOR setup

        for (uint256 i = 0; i < 100; i++) {
            gsg.addAndUpvote(_encodeKeyword(keywords[i]), (i + 1) * (1 ether));
        }

        // COLLECTION setup
        collection.setGenerator(address(generator));
    }

    function getDeployedContractAddress(
        DeployedContract c
    ) external view returns (address) {
        return addresses[c];
    }
}
