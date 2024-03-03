// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { AutomationCompatibleInterface } from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/utils/structs/DoubleEndedQueue.sol";
import "./GraviolaRandom.sol";
import "./GraviolaMetadata.sol";
import "./AIOracleCallbackReceiver.sol";
import "./GraviolaWell.sol";



// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Graviola is ERC721, GraviolaRandom, GraviolaMetadata, GraviolaWell, AutomationCompatibleInterface, AIOracleCallbackReceiver {
    using DoubleEndedQueue for DoubleEndedQueue.Bytes32Deque;

    uint64 private constant AIORACLE_CALLBACK_GAS_LIMIT = 5000000;

    uint256 private _nextTokenId;

    constructor(
        uint64 subscriptionId,
        address vrfCoordinator,
        bytes32 keyHash,
        address aiOracle
    ) ERC721("Graviola", "GRV") GraviolaRandom(subscriptionId, vrfCoordinator, keyHash) GraviolaWell() AIOracleCallbackReceiver(IAIOracle(aiOracle)) {}


    DoubleEndedQueue.Bytes32Deque private OAORequests;

    function requestMint() external {
        // TODO: fees mechanism
        requestRandomWords();
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        require(s_requests[requestId].exists, "request not found");
        s_requests[requestId].fulfilled = true;
        s_requests[requestId].randomWords = randomWords;
        
        // mints nft
        uint256 tokenId = _nextTokenId++;
        _safeMint(s_requests[requestId].requestor, tokenId);
        OAORequests.pushBack(bytes32(tokenId));
        
        // words well logic
        // string memory testPrompt = "ethereum logo";
        string memory prompt = rollWords(randomWords[0]);
        uint8 rarity = 25;
        
        // metadata
        addPrompt(tokenId, prompt);
        addRarity(tokenId, rarity);


        // request to ai oracle 
        aiOracle.requestCallback(1, bytes(prompt), address(this), this.receiveOAOCallback.selector, AIORACLE_CALLBACK_GAS_LIMIT);
    }

    function receiveOAOCallback(uint256 /*modelId*/, bytes calldata input, bytes calldata output) external onlyAIOracleCallback {
        addPromptResponse(string(input), string(output));
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
