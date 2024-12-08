// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {JsonWriter} from "solidity-json-writer/contracts/JsonWriter.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract GraviolaSchema {
    using JsonWriter for JsonWriter.Json;

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
        string[] memory metadata
    ) private pure returns (string memory) {
        JsonWriter.Json memory writer;
        writer = writer.writeStartObject();

        writer = writer.writeStringProperty("title", "AIGC Metadata"); // "title": "AIGC Metadata"
        writer = writer.writeStringProperty("type", "object"); // "type": "object"

        writer = writer.writeStartObject("properties"); // "properties": {
        _addStringProperty(writer, "name", Strings.toString(tokenId));
        _addStringProperty(writer, "description", metadata[0]);
        _addStringProperty(writer, "image", metadata[1]);
        _addStringProperty(writer, "prompt", metadata[0]);
        _addStringProperty(writer, "aigc_type", "image");
        _addStringProperty(writer, "aigc_data", "null");
        _addStringProperty(writer, "proof_type", "null");
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

    function _tokenURI(
        uint256 tokenId,
        string[] memory metadata
    ) external pure returns (string memory) {
        return
            _convertToBase64URL(bytes(_generateJSONSchema(tokenId, metadata)));
    }
}
