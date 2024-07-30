// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IGraviolaSeasonsArchive} from "./seasons/IGraviolaSeasonsArchive.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IGraviolaCollection} from "./IGraviolaCollection.sol";

contract GraviolaGenerator {
    string internal constant PROMPT_BASE =
        "Generate a minimalistic portrait of a fictional character. Use a solid color background. The main features of this character are: ";

    IERC20 private token;
    IGraviolaSeasonsArchive private archive;
    IGraviolaCollection private collection;

    constructor(
        address tokenAddress,
        address archiveAddress,
        address collectionAddress
    ) {
        token = IERC20(tokenAddress);
        archive = IGraviolaSeasonsArchive(archiveAddress);
        collection = IGraviolaCollection(collectionAddress);
    }

    function prepare() external {
        // request random words -> vrf req
    }

    function generate() external {
        // called by vrf response
        // get 3 random words
        // oao request
    }
}
