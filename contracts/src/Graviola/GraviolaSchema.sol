// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GraviolaCollection} from "./GraviolaCollection.sol";
import {JsonWriter} from "solidity-json-writer/contracts/JsonWriter.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract GraviolaSchema {
    using JsonWriter for JsonWriter.Json;

    //  | name          | type            | id |
    //  |===============|=================|====|
    //  | STRING        | string          | 0  | -> convert string to bytes
    //  | UINT          | uint256         | 1  | -> abi.encodePacked("uint256", value) or bytes(bytes32(value))
    //  | BOOL          | bool            | 3  | -> bytes[]{0} or bytes[]{1}
    //  | UINT_ARRAY    | uint256[]       | 5  | -> abi.encodePacked("uint256[]", value)

    //  | property | id | property-type |
    //  |==========|====|===============|
    //  | prompt   | 0  | STRING        |
    //  | image    | 1  | STRING        |
    //  | groups   | 2  | UINT_ARRAY    |
    //  | seasonId | 3  | UINT          |

    bytes32[] private availableProperties = [
        bytes32("prompt"),
        bytes32("image"),
        bytes32("groups"),
        bytes32("seasonId")
    ];

    GraviolaCollection public collection;

    constructor(address collectionAddress) {
        collection = GraviolaCollection(collectionAddress);
    }

    function _addStringProperty(
        JsonWriter.Json memory writer,
        string memory key,
        string memory value
    ) private pure {
        writer = writer.writeStartObject(key);
        writer = writer.writeStringProperty("type", "string");
        writer = writer.writeStringProperty("value", value);
    }

    function _generateJSONSchema(
        uint256 tokenId,
        bytes[] memory metadata
    ) private pure returns (string memory) {
        JsonWriter.Json memory writer;
        writer = writer.writeStartObject();

        writer = writer.writeStringProperty("title", "AIGC Metadata"); // "title": "AIGC Metadata"
        writer = writer.writeStringProperty("type", "object"); // "type": "object"

        writer = writer.writeStartObject("properties"); // "properties": {
        _addStringProperty(writer, "name", Strings.toString(tokenId));
        _addStringProperty(writer, "description", string(metadata[0]));
        _addStringProperty(writer, "image", string(metadata[1]));
        _addStringProperty(writer, "prompt", string(metadata[0]));
        _addStringProperty(writer, "aigc_type", "image");
        _addStringProperty(writer, "aigc_data", "null");
        _addStringProperty(writer, "proof_type", "opML");
        writer = writer.writeEndObject(); // }

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

    function _tokenURI(uint256 tokenId) external view returns (string memory) {
        bytes[] memory metadata = new bytes[](availableProperties.length);
        for (uint256 i = 0; i < availableProperties.length; i++) {
            metadata[i] = collection.readProperty(
                tokenId,
                availableProperties[i]
            );
        }

        return
            _convertToBase64URL(bytes(_generateJSONSchema(tokenId, metadata)));
    }
}
