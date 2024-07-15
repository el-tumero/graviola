// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;


contract BytesConverter {
    function bytesToUint256(
        bytes memory _bytes
    ) internal pure returns (uint256) {
        uint256 tempUint;
        assembly {
            tempUint := mload(add(add(_bytes, 0x20), 0))
        }
        return tempUint;
    }

    function uint256ToBytes(uint256 n) internal pure returns (bytes memory) {
        bytes memory b = new bytes(32);
        assembly {
            mstore(add(b, 32), n)
        }
        return b;
    }
}