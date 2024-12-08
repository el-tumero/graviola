// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

abstract contract GraviolaMetadata {
    string[] public propertyNames = ["prompt", "image", "weights", "seasonId"];
    mapping(uint256 => string[]) private properties;

    // | property | id |
    // |===============|
    // | prompt   | 0  |
    // | image    | 1  |
    // | weights  | 2  |
    // | seasonId | 3  |

    function _introduceProperty(string memory propertyName) internal {
        propertyNames.push(propertyName);
    }

    function _addProperty(
        uint256 tokenId,
        uint256 propertyId,
        string memory value
    ) internal {
        properties[tokenId][propertyId] = value;
    }

    function _readProperty(
        uint256 tokenId,
        uint256 propertyId
    ) internal view returns (string memory) {
        return properties[tokenId][propertyId];
    }

    function _getPropertyName(
        uint256 propertyId
    ) internal view returns (string memory) {
        return propertyNames[propertyId];
    }

    function _getMetadata(
        uint256 tokenId
    ) internal view returns (string[] memory) {
        return properties[tokenId];
    }

    function _addAigcData(
        uint256 tokenId,
        bytes calldata prompt,
        bytes calldata aigcData
    ) internal {
        _addProperty(tokenId, 0, string(prompt));
        _addProperty(tokenId, 1, string(aigcData));
    }
}
