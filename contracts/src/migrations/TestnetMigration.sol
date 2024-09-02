// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Migration} from "./Migration.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {GraviolaSeasonsArchive} from "../Graviola/seasons/archive/GraviolaSeasonsArchive.sol";

contract TestnetMigration is Migration, Ownable {
    constructor() Migration() Ownable(msg.sender) {}

    function addDeployedContractAddress(
        DeployedContract c,
        address contractAddress
    ) external onlyOwner {
        addresses[c] = address(contractAddress);
    }

    function setup() external override onlyOwner {
        GraviolaSeasonsArchive gsa = GraviolaSeasonsArchive(
            addresses[DeployedContract.SEASONS_ARCHIVE]
        );
        gsa.setSeasonsGovernor(migrator);
        gsa.nameSeason(0, "Summer 2024");
        gsa.addPromptBaseToSeason(0, DEFAULT_PROMPT_BASE);
        for (uint256 i = 0; i < NUMBER_OF_KEYWORDS; i++) {
            gsa.addKeywordToSeason(0, keywords[i]);
        }
        gsa.transferOwnership(msg.sender);
    }
}
