// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "solidity-json-writer/contracts/JsonWriter.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./seasons/IGraviolaSeasonsArchive.sol";

struct Metadata {
    string description;
    string image;
    uint256 rarity;
    uint256 weightSum;
    uint256 seasonId;
    bool isReady;
}

abstract contract GraviolaMetadata {
    using JsonWriter for JsonWriter.Json;

    mapping(uint256 => Metadata) private metadataStorage;

    IGraviolaSeasonsArchive immutable seasonsArchive;

    constructor(address seasonsArchiveAddress) {
        seasonsArchive = IGraviolaSeasonsArchive(seasonsArchiveAddress);
    }

    /// @notice Creates metadata and adds it to the metadata storage
    /// @param tokenId id of the token
    /// @param metadata Metadata struct object
    function _createMetadata(
        uint256 tokenId,
        Metadata memory metadata
    ) internal {
        metadataStorage[tokenId] = metadata;
    }

    /// @notice Adds image cid to metadata for the token with given tokenId
    /// @param tokenId id of the token
    /// @param image cid
    function _addImage(uint256 tokenId, string memory image) internal {
        metadataStorage[tokenId].image = image;
    }

    // -- conversions --

    function generateJSON(
        Metadata memory metadata
    ) private pure returns (string memory) {
        JsonWriter.Json memory writer;
        writer = writer.writeStartObject();
        writer = writer = writer.writeStringProperty(
            "description",
            metadata.description
        );
        writer = writer.writeStringProperty("image", metadata.image);
        writer = writer.writeStartArray("attributes");

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("trait_type", "Rarity");
        writer = writer.writeUintProperty("value", metadata.rarity);
        writer = writer.writeEndObject();

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("trait_type", "Weight Sum");
        writer = writer.writeUintProperty("value", metadata.weightSum);
        writer = writer.writeEndObject();

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("trait_type", "Season ID");
        writer = writer.writeUintProperty("value", metadata.seasonId);
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
        require(metadataStorage[tokenId].isReady, "Metadata is empty!");
        return
            convertToBase64URL(bytes(generateJSON(metadataStorage[tokenId])));
    }
}
