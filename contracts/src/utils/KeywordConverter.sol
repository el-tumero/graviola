// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

abstract contract KeywordConverter {
    /// @notice Encode keyword in string format to uint256
    /// @param keyword string representation of the keyword
    /// @return id uint256 representation of the keyword
    function _encodeKeyword(
        string memory keyword
    ) internal pure returns (uint256) {
        uint256 tempUint;
        bytes memory b = bytes(keyword);
        assembly {
            tempUint := mload(add(add(b, 0x20), 0))
        }
        return tempUint;
    }

    /// @notice Decode keyword from uint256 to string
    /// @param id uint256 representation of the keyword
    /// @return keyword string representation of the keyword
    function _decodeKeyword(uint256 id) internal pure returns (string memory) {
        bytes memory b = new bytes(32);
        assembly {
            mstore(add(b, 32), id)
        }
        return string(b);
    }
}
