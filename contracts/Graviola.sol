// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { AutomationCompatibleInterface } from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/utils/structs/DoubleEndedQueue.sol";
import "./GraviolaRandom.sol";
import "./GraviolaMetadata.sol";



// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Graviola is ERC721, GraviolaRandom, GraviolaMetadata, AutomationCompatibleInterface {
    using DoubleEndedQueue for DoubleEndedQueue.Bytes32Deque;


    uint256 private _nextTokenId;

    constructor(
        uint64 subscriptionId,
        address vrfCoordinator,
        bytes32 keyHash
    ) ERC721("Graviola", "GRV") GraviolaRandom(subscriptionId, vrfCoordinator, keyHash) {}

    // OAORequests 
    DoubleEndedQueue.Bytes32Deque private OAORequests;
    // mapping(uint256=>) 

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
        uint256 tokenId = _nextTokenId++;
        _safeMint(s_requests[requestId].requestor, tokenId);
        OAORequests.pushBack(bytes32(tokenId));
        
        // words well logic
        string memory testPrompt = "ethereum logo";
        uint8 rarity = 25;
        
        // metadata
        addPrompt(tokenId, testPrompt);
        addRarity(tokenId, rarity);


        // request to opML oracle
    }

    function debugOAOCallback(string memory prompt, string memory response) external{
        addPromptResponse(prompt, response);
    } 

    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        uint256 id = uint256(OAORequests.front());
        upkeepNeeded = hasPromptResponse(id);
        performData = abi.encode(id);
    }

    function performUpkeep(bytes calldata performData) external {
        (uint256 id) = abi.decode(performData, (uint256));
        savePromptResponseToMetadata(id);
        OAORequests.popFront();
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory){
        return _tokenURI(tokenId);
    }
}
