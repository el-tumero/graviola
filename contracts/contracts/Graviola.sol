// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/utils/structs/DoubleEndedQueue.sol";
import "./GraviolaMetadata.sol";
import "./AIOracleCallbackReceiver.sol";
import "./GraviolaWell.sol";
import "./VRFConsumer.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

/// @notice A base contract for Graviola non-fungible token
contract Graviola is
    ERC721,
    GraviolaMetadata,
    GraviolaWell,
    VRFConsumer,
    AutomationCompatibleInterface,
    AIOracleCallbackReceiver
{
    using DoubleEndedQueue for DoubleEndedQueue.Bytes32Deque;

    /// @notice PreMint is emitted when the account calls preMint()
    event PreMint(address addr, uint256 requestId);

    /// @notice PromptRequest is emitted when the request is sent to AIOracle
    event PromptRequest(string input);

    /// @notice PromptResponse is emitted when the response is written to the contract using its callback function (receiveOAOCallback)
    event PromptResponse(string input, string output);

    /// @notice TokenReady is emitted when the token has the complete metadata
    event TokenReady(address addr, uint256 tokenId);

    // gas limit for AIOracle callback function
    uint64 private constant AIORACLE_CALLBACK_GAS_LIMIT = 3_000_000;

    // stack for storing pending vrf request ids
    DoubleEndedQueue.Bytes32Deque private VRFRequests;

    // stack for storing pending AIOracle request ids
    DoubleEndedQueue.Bytes32Deque private OAORequests;

    /// @notice VRFRequest
    /// @notice requestor - address of the account which made the request
    /// @notice noiseId - id of the random value (stored in the VRFHost)
    /// @notice done - indicates whether the request was completed
    struct VRFRequest {
        address requestor;
        uint256 noiseId;
        bool done;
    }

    // maps vrf request id to VRFRequest struct
    mapping(uint256 => VRFRequest) vrfRequests;

    // is equal to the id of the next minted token
    uint256 private _nextTokenId;

    // is equal to the id of the next VRF request
    uint256 private _nextVrfReqId;

    // mapping for tokens owned by address (user)
    mapping(address => uint256[]) private _ownedTokens;

    /// @notice creates the ERC-721 token contract that uses verifiable randomness and on-chain AI oracles
    /// @param aiOracle address of the on-chain AI oracle contract
    /// @param vrfHost  address of the VRF host
    constructor(
        address aiOracle,
        address vrfHost
    )
        ERC721("Graviola", "GRV")
        GraviolaWell()
        VRFConsumer(vrfHost)
        AIOracleCallbackReceiver(IAIOracle(aiOracle))
    {}

    /// @notice does actions required before minting a token
    /// @dev is called by user
    function preMint() external {
        // uint256 noiseId = requestNoise()
        uint256 noiseId = 0;
        vrfRequests[_nextVrfReqId] = VRFRequest(msg.sender, noiseId, false);
        emit PreMint(msg.sender, _nextVrfReqId);
        ++_nextVrfReqId;
    }

    // -----

    function pasteRandomValue(uint256 reqId) internal {
        require(!vrfRequests[reqId].done, "request has already been processed");

        // uint256 randomValue = readNoise(vrfRequests[reqId].noiseId);
        uint256 randomValue = 0;
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
        aiOracle.requestCallback(
            1,
            input,
            address(this),
            this.receiveOAOCallback.selector,
            AIORACLE_CALLBACK_GAS_LIMIT
        );
    }

    function receiveOAOCallback(
        uint256 /*modelId*/,
        bytes calldata input,
        bytes calldata output
    ) external onlyAIOracleCallback {
        addPromptResponse(string(input), string(output));
        emit PromptResponse(string(input), string(output));
    }

    function replayOAORequest(uint256 tokenId) public {
        Metadata memory data = getMetadata(tokenId);
        require(
            !hasPromptResponse2(data.prompt),
            "prompt has already had response!"
        );
        bytes memory input = bytes(data.prompt);
        aiOracle.requestCallback(
            1,
            input,
            address(this),
            this.receiveOAOCallback.selector,
            AIORACLE_CALLBACK_GAS_LIMIT
        );
    }

    function checkUpkeep(
        bytes calldata
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        if (!VRFRequests.empty()) {
            uint256 id = uint256(VRFRequests.front());
            return (
                isRandomValueReady(vrfRequests[id].noiseId),
                abi.encode(uint8(0), id)
            );
        }
        if (!OAORequests.empty()) {
            uint256 id = uint256(OAORequests.front());
            return (hasPromptResponse(id), abi.encode(uint8(1), id));
        }
    }

    function performUpkeep(bytes calldata performData) external {
        (uint8 op, uint256 id) = abi.decode(performData, (uint8, uint256));
        if (op == 0) {
            pasteRandomValue(id);
            VRFRequests.popFront();
        }
        if (op == 1) {
            savePromptResponseToMetadata(id);
            OAORequests.popFront();
            emit TokenReady(address(0), id);
        }
    }

    function debugMint(address to) external {
        _safeMint(to, _nextTokenId);
        _nextTokenId++; 
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address previousOwner = super._update(to, tokenId, auth);

        if(to != address(0)) _ownedTokens[to].push(tokenId);
        return previousOwner;
    }



    function ownedTokens(address addr) public view returns (uint256[] memory output){
        uint256[] memory buffer = new uint256[](_ownedTokens[addr].length);
        uint256 j = 0;
        for (uint i = 0; i < _ownedTokens[addr].length; i++) {
            uint256 tokenId = _ownedTokens[addr][i];
            if(_ownerOf(tokenId) == addr){
                buffer[j] = tokenId;
                j++;
            }
        }
        output = new uint256[](j);
        for (uint i = 0; i < j; i++) {
            output[i] = buffer[i];
        }
    }

    function burn(uint256 tokenId) external {
        _burn(tokenId);
    } 


    function tokenURI(uint256 tokenId) public view virtual override returns (string memory){
        return _tokenURI(tokenId);
    }
}
