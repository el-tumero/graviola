// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

abstract contract GraviolaMetadata {
    error PropertyWrongType();

    //  | name          | type      | id |
    //  |===============|=================|====|
    //  | STRING        | string          | 0  |
    //  | UINT          | uint256         | 1  |
    //  | FLOAT         | uint256         | 2  |
    //  | BOOL          | bool            | 3  |
    //  | STRING_ARRAY  | bytes32[]       | 4  | ???
    //  | UINT_ARRAY    | uint256[]       | 5  |
    //  | FLOAT_ARRAY   | uint256         | 6  |
    //  | BOOL_ARRAY    | bool[]          | 7  |

    // TODO: think about removing array types

    //  | property | id | property-type |
    //  |==========|====|===============|
    //  | prompt   | 0  | STRING        |
    //  | image    | 1  | STRING        |
    //  | groups   | 2  | UINT_ARRAY    |
    //  | seasonId | 3  | UINT          |

    enum PropertyType {
        STRING,
        UINT,
        FLOAT,
        BOOL,
        STRING_ARRAY,
        UINT_ARRAY,
        FLOAT_ARRAY,
        BOOL_ARRAY
    }

    struct Property {
        PropertyType propertyType;
        mapping(uint256 => bytes) values;
    }

    mapping(bytes32 => Property) private properties;
    bytes32[] private availableProperties = [
        bytes32("prompt"),
        bytes32("image"),
        bytes32("groups"),
        bytes32("seasonId")
    ];

    constructor() {
        properties[bytes32("prompt")].propertyType = PropertyType.STRING;
        properties[bytes32("image")].propertyType = PropertyType.STRING;
        properties[bytes32("groups")].propertyType = PropertyType.UINT_ARRAY;
        properties[bytes32("seasonId")].propertyType = PropertyType.UINT;
    }

    // function _introduceProperty(string memory propertyName) internal {
    //     propertyNames.push(propertyName);
    // }

    function _addProperty(
        uint256 tokenId,
        bytes32 property,
        bytes memory value
    ) private {
        properties[property].values[tokenId] = value;
    }

    function _addUintProperty(
        uint256 tokenId,
        bytes32 property,
        uint256 value
    ) internal {
        if (properties[property].propertyType != PropertyType.UINT) {
            revert PropertyWrongType();
        }
        _addProperty(tokenId, property, abi.encodePacked("uint256", value));
    }

    function _addUintArrayProperty(
        uint256 tokenId,
        bytes32 property,
        uint256[] memory value
    ) internal {
        if (properties[property].propertyType != PropertyType.UINT_ARRAY) {
            revert PropertyWrongType();
        }
        _addProperty(tokenId, property, abi.encodePacked("uint256[]", value));
    }

    function _addStringProperty(
        uint256 tokenId,
        bytes32 property,
        bytes memory value
    ) internal {
        if (properties[property].propertyType != PropertyType.STRING) {
            revert PropertyWrongType();
        }
        _addProperty(tokenId, property, value);
    }

    function _addStringArrayProperty(
        uint256 tokenId,
        bytes32 property,
        string memory value
    ) internal {
        if (properties[property].propertyType != PropertyType.STRING_ARRAY) {
            revert PropertyWrongType();
        }
        _addProperty(tokenId, property, abi.encodePacked("string[]", value));
    }

    function _readProperty(
        uint256 tokenId,
        bytes32 property
    ) private view returns (bytes memory) {
        return properties[property].values[tokenId];
    }

    function _addAigcData(
        uint256 tokenId,
        bytes calldata prompt,
        bytes calldata aigcData
    ) internal {
        _addStringProperty(tokenId, bytes32("prompt"), prompt);
        _addStringProperty(tokenId, bytes32("image"), aigcData);
    }
}
