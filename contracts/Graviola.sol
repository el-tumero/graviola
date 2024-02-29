// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./GraviolaRandom.sol";


// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Graviola is ERC721, GraviolaRandom {
    uint256 private _nextTokenId;

    constructor(
        uint64 subscriptionId,
        address vrfCoordinator,
        bytes32 keyHash
    ) ERC721("Graviola", "GRV") GraviolaRandom(subscriptionId, vrfCoordinator, keyHash) {}


    function requestMint() external {
        // TODO: fees mechanism
        requestRandomWords();
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        require(s_requests[requestId].exists, "request not found");
        s_requests[requestId].fulfilled = true;
        s_requests[requestId].randomWords = randomWords;
        // console.log(randomWords[0]);
        
        // mints nft
        // uint256 tokenId = _nextTokenId++;
        // _safeMint(s_requests[requestId].requestor, tokenId);

        // words well logic

        // save to prompts mapping

        // metadata

        // request to opML oracle
    }
}
