// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {VRFV2PlusWrapperMock} from "../utils/VRFV2PlusWrapperMock.sol";
import {AIOracleMock} from "../OAO/AIOracleMock.sol";
import {GraviolaToken} from "./GraviolaToken.sol";
import {GraviolaCollection} from "./GraviolaCollection.sol";
import {GraviolaSeasonsArchive} from "./seasons/archive/GraviolaSeasonsArchive.sol";
import {GraviolaSeasonsGovernor} from "./seasons/governor/GraviolaSeasonsGovernor.sol";
import {GraviolaGenerator} from "./GraviolaGenerator.sol";
import {GraviolaCollectionReadProxy} from "./GraviolaCollectionReadProxy.sol";
import {KeywordConverter} from "../utils/KeywordConverter.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract GraviolaMigrator is KeywordConverter, Ownable {
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
        GENERATOR,
        COLLECTION_READ_PROXY
    }

    mapping(DeployedContract => address) internal addresses;

    address internal migrator = address(this);

    VRFV2PlusWrapperMock public vrf;
    AIOracleMock public oao;
    GraviolaToken public gt;
    GraviolaCollection public collection;
    GraviolaSeasonsArchive public gsa;
    GraviolaSeasonsGovernor public gsg;
    GraviolaGenerator public generator;
    GraviolaCollectionReadProxy public collectionReadProxy;

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

    constructor() Ownable(msg.sender) {}

    function setup() external {
        gsa = GraviolaSeasonsArchive(
            addresses[DeployedContract.SEASONS_ARCHIVE]
        );
        gsg = GraviolaSeasonsGovernor(
            addresses[DeployedContract.SEASONS_GOVERNOR]
        );
        generator = GraviolaGenerator(addresses[DeployedContract.GENERATOR]);
        collection = GraviolaCollection(addresses[DeployedContract.COLLECTION]);

        gsa.setSeasonsGovernor(migrator);
        gsa.nameSeason(0, "Summer 2024");
        gsa.addPromptBaseToSeason(0, DEFAULT_PROMPT_BASE);
        for (uint256 i = 0; i < NUMBER_OF_KEYWORDS; i++) {
            gsa.addKeywordToSeason(0, keywords[i]);
        }
        gsa.setSeasonsGovernor(address(gsg));
        gsa.transferOwnership(address(gsg));

        collection.setGenerator(address(generator));
    }

    function getDeployedContractAddress(
        DeployedContract c
    ) external view returns (address) {
        return addresses[c];
    }

    function addDeployedContractAddress(
        DeployedContract c,
        address contractAddress
    ) external onlyOwner {
        addresses[c] = address(contractAddress);
    }
}
