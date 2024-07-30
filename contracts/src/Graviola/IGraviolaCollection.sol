// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IGraviolaCollection is IERC721 {
    function ownedTokens(
        address addr
    ) external view returns (uint256[] memory output);
}
