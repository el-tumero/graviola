// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Graviola is ERC721 {
    uint256 private _nextTokenId;

    constructor() ERC721("Graviola", "GRV") {}

    function hello() external pure returns (string memory) {
        return "world";
    }

    function mint() external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        return tokenId;
    }
}
