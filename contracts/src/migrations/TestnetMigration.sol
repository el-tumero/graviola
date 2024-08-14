// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Migration} from "./Migration.sol";
import {GraviolaCollection} from "../Graviola/GraviolaCollection.sol";
import {IGraviolaSeasonsArchive} from "../Graviola/seasons/archive/IGraviolaSeasonsArchive.sol";

contract TestnetMigration is Migration {
    constructor() Migration() {}

    function addDeployedContractAddress(
        DeployedContract c,
        address contractAddress
    ) external {
        addresses[c] = address(contractAddress);
    }

    function setup() external override {
        GraviolaCollection(addresses[DeployedContract.COLLECTION])
            .transferOwnership(addresses[DeployedContract.GENERATOR]);

        IGraviolaSeasonsArchive gsa = IGraviolaSeasonsArchive(
            addresses[DeployedContract.SEASONS_ARCHIVE]
        );

        gsa.nameSeason(0, "Summer 2024");
        gsa.addPromptBaseToSeason(0, DEFAULT_PROMPT_BASE);

        // fill season with keywords
        for (uint256 i = 0; i < NUMBER_OF_KEYWORDS; i++) {
            gsa.addKeywordToSeason(0, keywords[i]);
        }
    }
}
