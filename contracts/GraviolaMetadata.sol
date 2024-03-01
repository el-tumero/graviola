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

    mapping(uint256 => Metadata) private metadataStorage;

    // DEBUG function - must be removed after local tests
    function debugAddMetadata(uint256 tokenId, string memory image, string memory prompt) external {
        metadataStorage[tokenId] = Metadata(image, prompt, 25, true);
    }

    // NOTE: addRarity() should be called after this func
    function addPrompt(uint256 tokenId, string memory prompt) internal {
        require(!metadataStorage[tokenId].filled, "Metadata is filled!");
        metadataStorage[tokenId].prompt = prompt;
    }

    // NOTE: storeAIResult() should be called after this func
    function addRarity(uint256 tokenId, uint8 rarity) internal {
        require(!metadataStorage[tokenId].filled, "Metadata is filled!");
        metadataStorage[tokenId].rarity = rarity;
    }

    function addImage(uint256 tokenId, string memory image) internal {
        require(!metadataStorage[tokenId].filled, "Metadata is filled!");
        metadataStorage[tokenId].image = image;
        metadataStorage[tokenId].filled = true;
    }

    function getPrompt(uint256 tokenId) internal view returns (string memory) {
        return metadataStorage[tokenId].prompt;
    }

    // -- conversions --

    function generateJSON(string memory image, string memory prompt, uint8 rarity) internal pure returns (string memory) {
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

    function convertToBase64URL(bytes memory data) internal pure returns(string memory) {
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(data)
            )
        );
    }

    // NOTE: test

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(metadataStorage[tokenId].filled, "Metadata is empty!");
        return convertToBase64URL(bytes(generateJSON(metadataStorage[tokenId].image, metadataStorage[tokenId].prompt, metadataStorage[tokenId].rarity)));
    }
}