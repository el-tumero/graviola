// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { AutomationCompatibleInterface } from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/utils/structs/DoubleEndedQueue.sol";
import "./GraviolaMetadata.sol";
import "./AIOracleCallbackReceiver.sol";
import "./GraviolaWell.sol";
import "./VRFConsumer.sol";


// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Graviola is ERC721, GraviolaMetadata, GraviolaWell, VRFConsumer, AutomationCompatibleInterface, AIOracleCallbackReceiver {
    using DoubleEndedQueue for DoubleEndedQueue.Bytes32Deque;

    event RequestSent(uint256 refId);
    event TokenReady(uint256 tokenId);
    event PromptResponse(string input, string output);

    uint64 private constant AIORACLE_CALLBACK_GAS_LIMIT = 30_000_000;

    uint256 private _nextTokenId;
    uint256 private _nextVrfReqId;

    constructor(
        address aiOracle,
        address vrfHost
    ) ERC721("Graviola", "GRV") GraviolaWell() VRFConsumer(vrfHost) AIOracleCallbackReceiver(IAIOracle(aiOracle)) {}


    DoubleEndedQueue.Bytes32Deque private OAORequests;
    DoubleEndedQueue.Bytes32Deque private VRFRequests;


    struct VRFRequest {
        address requestor;
        uint256 refId;
        bool done;
    }


    // vrf request id

    mapping(uint256 => VRFRequest) vrfRequests;


    function requestMint() external {
        // TODO: fees mechanism
        uint256 refId = saveRandomValue();
        vrfRequests[_nextVrfReqId] = VRFRequest(msg.sender, refId, false);
        VRFRequests.pushBack(bytes32(_nextVrfReqId));
        emit RequestSent(_nextVrfReqId);
        _nextVrfReqId++;
    }

    function pasteRandomValue(uint256 reqId) internal {
        require(!vrfRequests[reqId].done, "request has already been processed");

        uint256 randomValue = readRandomValue(vrfRequests[reqId].refId);
        vrfRequests[reqId].done = true;

        
        // mints nft
        uint256 tokenId = _nextTokenId++;
        _safeMint(vrfRequests[reqId].requestor, tokenId);        
        OAORequests.pushBack(bytes32(tokenId));
        
        // words well logic
        string memory prompt;
        uint256 rarity;
        (prompt, rarity) = rollWords(randomValue);
        
        string memory fullPrompt = string.concat(promptBase, prompt);

        // metadata
        addPrompt(tokenId, fullPrompt);
        addRarity(tokenId, rarity);
        bytes memory input = bytes(fullPrompt);

        // request to ai oracle 
        aiOracle.requestCallback(1, input, address(this), this.receiveOAOCallback.selector, AIORACLE_CALLBACK_GAS_LIMIT);
    }

    function receiveOAOCallback(uint256 /*modelId*/, bytes calldata input, bytes calldata output) external onlyAIOracleCallback {
        addPromptResponse(string(input), string(output));
        emit PromptResponse(string(input), string(output));
    }

    function replayOAORequest(uint256 tokenId) public{
        Metadata memory data = getMetadata(tokenId);
        require(!hasPromptResponse2(data.prompt), "prompt has already had response!");
        bytes memory input = bytes(data.prompt);
        aiOracle.requestCallback(1, input, address(this), this.receiveOAOCallback.selector, AIORACLE_CALLBACK_GAS_LIMIT);
    }


    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        if(!VRFRequests.empty()){
            uint256 id = uint256(VRFRequests.front());
            return (isRandomValueReady(vrfRequests[id].refId), abi.encode(uint8(0), id));
        }
        if(!OAORequests.empty()){
            uint256 id = uint256(OAORequests.front());
            return (hasPromptResponse(id), abi.encode(uint8(1), id));            
        }
    }

    function performUpkeep(bytes calldata performData) external {
        (uint8 op, uint256 id) = abi.decode(performData, (uint8, uint256));
        if(op == 0) {
            pasteRandomValue(id);
            VRFRequests.popFront();
        }
        if(op == 1) {
            savePromptResponseToMetadata(id);
            OAORequests.popFront();
            emit TokenReady(id);
        }
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory){
        return _tokenURI(tokenId);
    }
}
