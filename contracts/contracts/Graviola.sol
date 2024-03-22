// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/utils/structs/DoubleEndedQueue.sol";
import "./GraviolaMetadata.sol";
import "./AIOracleCallbackReceiver.sol";
import "./GraviolaWell.sol";
import "./GraviolaNonFungible.sol";
import "./VRFConsumer.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/// @notice A base contract for Graviola non-fungible token
contract Graviola is
    GraviolaNonFungible,
    GraviolaMetadata,
    GraviolaWell,
    AIOracleCallbackReceiver
{
    using DoubleEndedQueue for DoubleEndedQueue.Bytes32Deque;

    /// @notice Mint is emitted when the account calls mint()
    event Mint(address addr, uint256 tokenId);

    /// @notice PromptRequest is emitted when the request is sent to AIOracle
    event PromptRequest(uint256 tokenId, string keywords, uint256 rarity);

    /// @notice PromptResponse is emitted when the response is written to the contract using its callback function (receiveOAOCallback)
    event PromptResponse(string input, string output);

    /// @notice TokenReady is emitted when the token has the complete metadata
    event TokenReady(address addr, uint256 tokenId);

    // gas limit for AIOracle callback function
    uint64 private constant AIORACLE_CALLBACK_GAS_LIMIT = 200_000;
    
    // Stable Diffusion model id
    uint256 constant AIORACLE_MODEL_ID = 50;

    // stack for storing pending vrf request ids
    // DoubleEndedQueue.Bytes32Deque private VRFRequests;



    /// @notice VRFRequest
    /// @notice requestor - address of the account which made the request
    /// @notice noiseId - id of the random value (stored in the VRFHost)
    /// @notice isReady - indicates whether the request is ready
    /// @notice isDone - indicates whether the request was completed
    struct VRFRequest {
        address requestor;
        uint256 noiseId;
        bool isReady;
        bool isDone;
    }

    enum OAORequestStatus {
        NON_EXISTENT,
        EXISTENT,
        DONE
    }


    // maps token id to VRFRequest struct
    // mapping(uint256 => VRFRequest) vrfRequests;

    // maps AIOracle request to its status
    mapping(uint256 => OAORequestStatus) oaoRequestsStatus;

    // is equal to the id of the next minted token
    uint256 private _nextTokenId;

    // is equal to the id of the next VRF request
    // uint256 private _nextVrfReqId;


    /// @notice creates the ERC-721 token contract that uses verifiable randomness and on-chain AI oracles
    /// @param aiOracle address of the on-chain AI oracle contract
    /// @param vrfHost  address of the VRF host
    constructor(
        address aiOracle,
        address vrfHost
    )
        ERC721("Graviola", "GRV")
        GraviolaNonFungible()
        GraviolaWell()
        AIOracleCallbackReceiver(IAIOracle(aiOracle))
    {}

    /// @notice minting a token without metadata
    /// @dev is called by user
    function mint() external payable {
        require(msg.value > estimateFee() + 0.005 ether);
        _safeMint(msg.sender, _nextTokenId);
        emit Mint(msg.sender, _nextTokenId);
        pasteRandomValue(_nextTokenId); // temp
        
        ++_nextTokenId;
    }

    // -----

    function pasteRandomValue(uint256 tokenId) internal {
        // require(vrfRequests[tokenId].isReady, "there is no response for that request!");
        // require(!vrfRequests[tokenId].isDone, "request has already been processed");

        // uint256 randomValue = readNoise(vrfRequests[reqId].noiseId);
        uint256 randomValue = uint256(blockhash(block.number - 1)); // temp option
        // vrfRequests[tokenId].isDone = true;


        // words well logic
        (string memory prompt, uint256 rarity, ) = rollWords(randomValue);

        string memory fullPrompt = string.concat(promptBase, prompt);

        // metadata
        addPrompt(tokenId, prompt);
        addRarity(tokenId, rarity);

        // request to ai oracle
        aiOracleRequest(tokenId, fullPrompt);
        emit PromptRequest(tokenId, prompt, rarity);
    }

    

    function tradeUp(uint[TOKENS_PER_TRADE_UP] memory _tradeUpTokenIds) external payable {
        require(msg.value > estimateFee() + 0.005 ether, "Fee is too low!");
        require(
            _ownerOf(_tradeUpTokenIds[0]) != msg.sender ||
            _ownerOf(_tradeUpTokenIds[1]) != msg.sender ||
            _ownerOf(_tradeUpTokenIds[2]) != msg.sender,
            "Only the owner of the tokens can trade them up!"
        );

        // check if the tokens has the same rarity rarity
        (bool sameRarities, uint rarityId) = raritiesInTheSameGroup(getRarities(_tradeUpTokenIds[0], _tradeUpTokenIds[1], _tradeUpTokenIds[2]));
        require(sameRarities);


        // mints
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        emit Mint(msg.sender, tokenId);

        uint256 randomValue = uint256(blockhash(block.number - 1)); // temp option
        (string memory prompt, uint256 rarity,) = _tradeUp(randomValue, rarityId);
        
        // burns old tokens 
        _burn(_tradeUpTokenIds[0]);        
        _burn(_tradeUpTokenIds[1]);        
        _burn(_tradeUpTokenIds[2]);        

        string memory fullPrompt = string.concat(promptBase, prompt);
        
        // adds metadata
        addPrompt(tokenId, prompt);
        addRarity(tokenId, rarity);

        // requests ai oracle
        aiOracleRequest(tokenId, fullPrompt);
        emit PromptRequest(tokenId, prompt, rarity);
    }

    function aiOracleRequest(uint256 _tokenId, string memory _input) internal {
        uint256 requestId = aiOracle.requestCallback{value: estimateFee()}(
            AIORACLE_MODEL_ID,
            bytes(_input),
            address(this),
            AIORACLE_CALLBACK_GAS_LIMIT,
            abi.encode(_tokenId)
        );
        oaoRequestsStatus[requestId] = OAORequestStatus.EXISTENT;
    }

    function aiOracleCallback(uint256 requestId, bytes calldata output, bytes calldata callbackData) external override onlyAIOracleCallback {
        require(oaoRequestsStatus[requestId] == OAORequestStatus.EXISTENT);
        uint256 tokenId = abi.decode(callbackData, (uint256));
        addImage(tokenId, string(output));
        oaoRequestsStatus[requestId] = OAORequestStatus.DONE;
        emit TokenReady(ownerOf(tokenId), tokenId);
    }

    function estimateFee() public view returns(uint256){
        return aiOracle.estimateFee(AIORACLE_MODEL_ID, AIORACLE_CALLBACK_GAS_LIMIT);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return _tokenURI(tokenId);
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    

    // function addWordToWellOfWords(string memory _keyword, uint256 _seed) external {
    //     require(balanceOf(msg.sender) > 0);
    //     addWordToWell(_keyword, _seed);
    // }
    
}
