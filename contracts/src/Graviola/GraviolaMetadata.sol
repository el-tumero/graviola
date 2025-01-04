// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

abstract contract GraviolaMetadata {
    mapping(bytes32 => mapping(uint256 => bytes)) private properties;

    function _addProperty(
        uint256 tokenId,
        bytes32 property,
        bytes memory value
    ) internal {
        properties[property][tokenId] = value;
    }

    function _readProperty(
        uint256 tokenId,
        bytes32 property
    ) internal view returns (bytes memory) {
        return properties[property][tokenId];
    }

    function _addAigcData(
        uint256 tokenId,
        bytes calldata prompt,
        bytes calldata aigcData
    ) internal {
        _addProperty(tokenId, "prompt", prompt);
        _addProperty(tokenId, "image", aigcData);
    }
}
