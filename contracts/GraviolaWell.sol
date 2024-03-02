// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract GraviolaWell {

    struct Word {
        string keyword;
        uint256 rarityFactor;
    }

    Word[] public WELL_OF_WORDS;

    constructor() {
        // Init base keywords and rarity factors
        WELL_OF_WORDS = [
            Word("human", 1000),
            Word("goblin", 200),
            Word("alien", 100),
            Word("elf", 50),
            Word("cyborg", 10),
            Word("android", 2),
            Word("green", 100),
            Word("angry", 80),
            Word("stunned", 90),
            Word("monobrow", 15),
            Word("piercing", 20),
            Word("bald", 10),
            Word("tattoo", 30),
            Word("hairy", 5),
            Word("white", 500),
            Word("green", 500),
            Word("black", 500),
            Word("red", 500),
            Word("blue", 500),
            Word("yellow", 500)
        ];
    }

    function addWordToWell(string memory _keyword) public {
        // Reject if caller does not own at least one NFT
        // Keyword should be below 12? 16? characters
        // Roll rarity for new keyword using VRF
        // Create a Word struct
        // Push to WELL_OF_WORDS
    }

    function rollWord(uint256 memory _id) public {


    }


    


    



}