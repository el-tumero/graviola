// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "solidity-json-writer/contracts/JsonWriter.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

struct Metadata {
    string image;
    string prompt;
    uint256 rarity;
    uint256 weightSum;
    bool filled;
}

contract GraviolaMetadata {
    using JsonWriter for JsonWriter.Json;

    mapping(uint256 => Metadata) private metadataStorage;
    string internal constant promptBase =
        "Generate a minimalistic portrait of a fictional character. Use a solid color background. The main features of this character are: ";

    // NOTE: addRarity() should be called after this func
    function addPrompt(uint256 tokenId, string memory prompt) internal {
        require(!metadataStorage[tokenId].filled, "Metadata is filled!");
        metadataStorage[tokenId].prompt = prompt;
    }

    // NOTE: requestCallback() should be called after this func
    function addRarity(uint256 tokenId, uint256 rarity) internal {
        require(!metadataStorage[tokenId].filled, "Metadata is filled!");
        metadataStorage[tokenId].rarity = rarity;
    }

    function addWeightSum(uint256 tokenId, uint256 sum) internal {
        require(!metadataStorage[tokenId].filled, "Metadata is filled!");
        metadataStorage[tokenId].weightSum = sum;
    }

    /// @notice Adds image cid to metadata for the token with given tokenId
    /// @param tokenId id of the token
    /// @param image cid
    function addImage(uint256 tokenId, string memory image) internal {
        require(!metadataStorage[tokenId].filled, "Metadata is filled!");
        metadataStorage[tokenId].image = image;
        metadataStorage[tokenId].filled = true;
    }

    function getMetadata(
        uint256 tokenId
    ) public view returns (Metadata memory) {
        return metadataStorage[tokenId];
    }

    // -- conversions --

    function generateJSON(
        string memory image,
        string memory prompt,
        uint256 rarity,
        uint256 weightSum
    ) private pure returns (string memory) {
        JsonWriter.Json memory writer;
        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("image", image);
        writer = writer.writeStringProperty("description", prompt);
        writer = writer.writeStartArray("attributes");

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("trait_type", "Rarity");
        writer = writer.writeUintProperty("value", rarity);
        writer = writer.writeEndObject();

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("trait_type", "Weight Sum");
        writer = writer.writeUintProperty("value", weightSum);
        writer = writer.writeEndObject();

        writer = writer.writeEndArray();
        writer = writer.writeEndObject();

        return writer.value;
    }

    function convertToBase64URL(
        bytes memory data
    ) private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(data)
                )
            );
    }

    // NOTE: public only for local tests
    function _tokenURI(uint256 tokenId) internal view returns (string memory) {
        require(metadataStorage[tokenId].filled, "Metadata is empty!");
        return
            convertToBase64URL(
                bytes(
                    generateJSON(
                        metadataStorage[tokenId].image,
                        string.concat(
                            promptBase,
                            metadataStorage[tokenId].prompt
                        ),
                        metadataStorage[tokenId].rarity,
                        metadataStorage[tokenId].weightSum
                    )
                )
            );
    }
}
