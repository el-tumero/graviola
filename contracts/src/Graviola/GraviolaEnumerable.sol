// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC7007Enumerable} from "../OAO/IERC7007Enumerable.sol";

abstract contract GraviolaEnumerable is IERC7007Enumerable {
    mapping(uint256 => string) public prompt;
    mapping(bytes => uint256) public tokenId;
}
