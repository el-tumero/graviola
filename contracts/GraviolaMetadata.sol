// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "solidity-json-writer/contracts/JsonWriter.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract GraviolaMetadata {
    using JsonWriter for JsonWriter.Json;
    
    struct Metadata {
        string image;
        string prompt;
        uint8 rarity;
        bool filled;
    }

    struct PromptsResponse {
        string response;
        bool exists;
    }

    mapping(uint256 => Metadata) private metadataStorage;
    mapping(string=>PromptsResponse) private promptsStorage;

    // DEBUG function - must be removed after local tests
    // function debugAddMetadata(uint256 tokenId, string memory image, string memory prompt) external {
    //     metadataStorage[tokenId] = Metadata(image, prompt, 25, true);
    // }

    // NOTE: addRarity() should be called after this func
    function addPrompt(uint256 tokenId, string memory prompt) internal {
        require(!metadataStorage[tokenId].filled, "Metadata is filled!");
        metadataStorage[tokenId].prompt = prompt;

        // NOTE: low probability of failure of this mechanism
        if(promptsStorage[prompt].exists) promptsStorage[prompt].exists = false;
    }

    // NOTE: requestCallback() should be called after this func
    function addRarity(uint256 tokenId, uint8 rarity) internal {
        require(!metadataStorage[tokenId].filled, "Metadata is filled!");
        metadataStorage[tokenId].rarity = rarity;
    }

    // NOTE: should be exec in OAO callback
    function addPromptResponse(string memory prompt, string memory response) internal {
        promptsStorage[prompt].response = response;
        promptsStorage[prompt].exists = true;
    }

    // NOTE: should be exec in checkUpkeep
    function hasPromptResponse(uint256 tokenId) internal view returns(bool) {
        string memory prompt = metadataStorage[tokenId].prompt;
        return promptsStorage[prompt].exists;
    }

    function addImage(uint256 tokenId, string memory image) private {
        require(!metadataStorage[tokenId].filled, "Metadata is filled!");
        metadataStorage[tokenId].image = image;
        metadataStorage[tokenId].filled = true;
    }

    // NOTE: should be exec in performUpkeep
    function savePromptResponseToMetadata(uint256 tokenId) internal {
        string memory prompt = metadataStorage[tokenId].prompt;
        require(promptsStorage[prompt].exists, "Prompt response does not exists!");
        addImage(tokenId, promptsStorage[prompt].response);
    }

    // -- conversions --

    function generateJSON(string memory image, string memory prompt, uint8 rarity) private pure returns (string memory) {
        JsonWriter.Json memory writer;
        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("image", image);
        writer = writer.writeStringProperty("description", prompt);
        writer = writer.writeStartArray("attributes");
            writer = writer.writeStartObject();
            writer = writer.writeStringProperty("trait_type", "Rarity");
            writer = writer.writeUintProperty("value", rarity);
            writer = writer.writeEndObject();
        writer = writer.writeEndArray();
        writer = writer.writeEndObject();

        return writer.value;
    }

    function convertToBase64URL(bytes memory data) private pure returns(string memory) {
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(data)
            )
        );
    }

    // NOTE: public only for local tests
    function _tokenURI(uint256 tokenId) internal view returns (string memory) {
        require(metadataStorage[tokenId].filled, "Metadata is empty!");
        return convertToBase64URL(bytes(generateJSON(metadataStorage[tokenId].image, metadataStorage[tokenId].prompt, metadataStorage[tokenId].rarity)));
    }
}