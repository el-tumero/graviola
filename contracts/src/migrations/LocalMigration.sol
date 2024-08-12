// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GraviolaGenerator} from "../Graviola/GraviolaGenerator.sol";
import {AIOracleMock} from "../OAO/AIOracleMock.sol";
import {GraviolaToken} from "../Graviola/GraviolaToken.sol";
import {GraviolaSeasonsArchive} from "../Graviola/seasons/archive/GraviolaSeasonsArchive.sol";
import {TGraviolaSeasonsGovernor} from "../Graviola/seasons/governor/TGraviolaSeasonsGovernor.sol";
import {VRFV2PlusWrapperMock} from "../utils/VRFV2PlusWrapperMock.sol";
import {GraviolaCollection} from "../Graviola/GraviolaCollection.sol";

contract LocalMigration {
    uint256 private constant NUMBER_OF_CONTRACTS = 7;

    string private constant DEFAULT_PROMPT_BASE =
        "Generate a minimalistic portrait of a fictional character. Use a solid color background. The main features of this character are: ";

    uint256 private constant NUMBER_OF_KEYWORDS = 100;

    string[NUMBER_OF_KEYWORDS] private keywords = [
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

    string[NUMBER_OF_CONTRACTS] private names = [
        "VRF",
        "OAO",
        "TOKEN",
        "COLLECTION",
        "SEASONS_ARCHIVE",
        "SEASONS_GOVERNOR"
        "GENERATOR"
    ];

    VRFV2PlusWrapperMock private vrf;
    AIOracleMock private oao;
    GraviolaToken private gt;
    GraviolaCollection private collection;
    GraviolaSeasonsArchive private gsa;
    TGraviolaSeasonsGovernor private gsg;
    GraviolaGenerator private generator;

    function run() external {
        vrf = new VRFV2PlusWrapperMock();
        oao = new AIOracleMock();
        gt = new GraviolaToken(msg.sender);
        gsa = new GraviolaSeasonsArchive(msg.sender);
        gsg = new TGraviolaSeasonsGovernor(address(gsa), address(gt));
        collection = new GraviolaCollection(msg.sender, address(1));

        generator = new GraviolaGenerator(
            address(gt),
            address(gsa),
            address(collection),
            address(oao),
            address(vrf)
        );

        for (uint256 i = 1; i < 100; i++) {
            gsg.addAndUpvote(i);
        }

        gsa.nameSeason(0, "Summer 2024");
        gsa.addPromptBaseToSeason(0, DEFAULT_PROMPT_BASE);

        // fill season with keywords
        for (uint256 i = 0; i < NUMBER_OF_KEYWORDS; i++) {
            gsa.addKeywordToSeason(0, keywords[i]);
        }
    }

    function getNames()
        external
        view
        returns (string[NUMBER_OF_CONTRACTS] memory)
    {
        return names;
    }

    function getAddresses()
        external
        view
        returns (address[NUMBER_OF_CONTRACTS] memory)
    {
        return [
            address(vrf),
            address(oao),
            address(gt),
            address(collection),
            address(gsa),
            address(gsg),
            address(generator)
        ];
    }
}
