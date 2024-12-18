// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IGraviolaCollection is IERC721 {
    function mint(uint256 tokenId, address to) external;

    function ownedTokens(
        address addr
    ) external view returns (uint256[] memory output);

    function getMetadata(
        uint256 tokenId
    ) external view returns (string[] memory);

    function burn(uint256 tokenId) external;

    function burnByGenerator(uint256 tokenId) external;
}
