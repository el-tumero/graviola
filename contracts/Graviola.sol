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
// import "hardhat/console.sol";

contract Graviola is ERC721, GraviolaMetadata, GraviolaWell, VRFConsumer, AutomationCompatibleInterface, AIOracleCallbackReceiver {
    using DoubleEndedQueue for DoubleEndedQueue.Bytes32Deque;

    event RequestSent(uint256 refId);
    event TokenReady(uint256 tokenId);

    uint64 private constant AIORACLE_CALLBACK_GAS_LIMIT = 5000000;

    uint256 private _nextTokenId;

    constructor(
        address aiOracle,
        address vrfHost
    ) ERC721("Graviola", "GRV") GraviolaWell() VRFConsumer(vrfHost) AIOracleCallbackReceiver(IAIOracle(aiOracle)) {}


    DoubleEndedQueue.Bytes32Deque private OAORequests;
    DoubleEndedQueue.Bytes32Deque private VRFRequests;


    struct VRFRequest {
        address requestor;
        bool done;
    }
    mapping(uint256 => VRFRequest) vrfRequests;


    function requestMint() external {
        // TODO: fees mechanism
        uint256 refId = saveRandomValue();
        vrfRequests[refId] = VRFRequest(msg.sender, false);
        VRFRequests.pushBack(bytes32(refId));
        emit RequestSent(refId);
    }

    function pasteRandomValue(uint256 refId) internal {
        require(!vrfRequests[refId].done, "request has already been processed");

        uint256 randomValue = readRandomValue(refId);
        vrfRequests[refId].done = true;

        
        // mints nft
        uint256 tokenId = _nextTokenId++;
        _safeMint(vrfRequests[refId].requestor, tokenId);        
        OAORequests.pushBack(bytes32(tokenId));
        
        // words well logic
        string memory prompt;
        uint256 rarity;
        (prompt, rarity) = rollWords(randomValue);

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
        if(!VRFRequests.empty()){
            uint256 refId = uint256(VRFRequests.front());
            return (isRandomValueReady(refId), abi.encode(uint8(0), refId));
        }
        if(!OAORequests.empty()){
            uint256 id = uint256(OAORequests.front());
            return(hasPromptResponse(id), abi.encode(uint8(1), id));
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
