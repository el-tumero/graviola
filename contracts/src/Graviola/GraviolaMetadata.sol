// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {JsonWriter} from "solidity-json-writer/contracts/JsonWriter.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {IGraviolaSeasonsArchive} from "./seasons/archive/IGraviolaSeasonsArchive.sol";

struct Metadata {
    string description;
    string image;
    uint256 probability;
    uint256 score;
    uint256 seasonId;
    bool isReady;
}

abstract contract GraviolaMetadata {
    using JsonWriter for JsonWriter.Json;

    error MetadataEmpty();

    mapping(uint256 => Metadata) private metadataStorage;

    IGraviolaSeasonsArchive private immutable SEASONS_ARCHIVE;

    constructor(address seasonsArchiveAddress) {
        SEASONS_ARCHIVE = IGraviolaSeasonsArchive(seasonsArchiveAddress);
    }

    function _getMetadata(
        uint256 tokenId
    ) internal view returns (Metadata memory) {
        return metadataStorage[tokenId];
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
        metadataStorage[tokenId].isReady = true;
    }

    // -- conversions --

    function _generateJSON(
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
        writer = writer.writeStringProperty("trait_type", "Probability");
        writer = writer.writeUintProperty("value", metadata.probability);
        writer = writer.writeEndObject();

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("trait_type", "Score");
        writer = writer.writeUintProperty("value", metadata.score);
        writer = writer.writeEndObject();

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("trait_type", "Season ID");
        writer = writer.writeUintProperty("value", metadata.seasonId);
        writer = writer.writeEndObject();

        writer = writer.writeEndArray();
        writer = writer.writeEndObject();

        return writer.value;
    }

    function _convertToBase64URL(
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
        if (!metadataStorage[tokenId].isReady) {
            revert MetadataEmpty();
        }
        return
            _convertToBase64URL(bytes(_generateJSON(metadataStorage[tokenId])));
    }
}
