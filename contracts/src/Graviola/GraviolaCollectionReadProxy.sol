// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GraviolaCollection} from "./GraviolaCollection.sol";
import {GraviolaSchema} from "./GraviolaSchema.sol";

contract GraviolaCollectionReadProxy {
    GraviolaCollection public collection;
    GraviolaSchema public schema;

    constructor(address collectionAddress, address schemaAddress) {
        collection = GraviolaCollection(collectionAddress);
        schema = GraviolaSchema(schemaAddress);
    }

    function getProperties(
        uint256 tokenId
    ) external view returns (bytes32[] memory, bytes[] memory) {
        bytes32[] memory availableProperties = schema.getAvailableProperties();
        bytes[] memory values = new bytes[](availableProperties.length);

        for (uint256 i = 0; i < availableProperties.length; i++) {
            values[i] = collection.readProperty(
                tokenId,
                availableProperties[i]
            );
        }
        return (availableProperties, values);
    }

    function tokenRange(
        uint256 start,
        uint256 stop
    )
        external
        view
        returns (uint256[] memory, bytes32[] memory, bytes[] memory)
    {
        uint256 length = stop - start;
        uint256[] memory ids = new uint256[](length);
        bytes32[] memory availableProperties = schema.getAvailableProperties();
        bytes[] memory values = new bytes[](
            length * availableProperties.length
        );

        for (uint256 i = 0; i < length; i++) {
            uint256 tokenId = collection.tokenByIndex(i + start);
            ids[i] = tokenId;
            for (uint256 j = 0; j < availableProperties.length; j++) {
                values[i * availableProperties.length + j] = collection
                    .readProperty(tokenId, availableProperties[j]);
            }
        }
        return (ids, availableProperties, values);
    }

    function tokenOfOwnerRange(
        address owner,
        uint256 start,
        uint256 stop
    )
        external
        view
        returns (uint256[] memory, bytes32[] memory, bytes[] memory)
    {
        uint256 length = stop - start;
        uint256[] memory ids = new uint256[](length);
        bytes32[] memory availableProperties = schema.getAvailableProperties();
        bytes[] memory values = new bytes[](
            length * availableProperties.length
        );

        for (uint256 i = 0; i < length; i++) {
            uint256 tokenId = collection.tokenOfOwnerByIndex(owner, i + start);
            ids[i] = tokenId;
            for (uint256 j = 0; j < availableProperties.length; j++) {
                values[i * availableProperties.length + j] = collection
                    .readProperty(tokenId, availableProperties[j]);
            }
        }
        return (ids, availableProperties, values);
    }
}
