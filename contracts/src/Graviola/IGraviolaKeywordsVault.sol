// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IGraviolaKeywordsVault {
    function getKeyword(uint256 wordId) external view returns (string memory);
    function getPromptBase() external view returns (string memory);
}
