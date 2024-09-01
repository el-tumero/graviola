// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import {Metadata} from "./GraviolaMetadata.sol";

interface IGraviolaCollection is IERC721 {
    function mint(address to) external returns (uint256);

    function addImage(uint256 tokenId, string memory image) external;

    function ownedTokens(
        address addr
    ) external view returns (uint256[] memory output);

    function createMetadata(uint256 tokenId, Metadata memory metadata) external;

    function getMetadata(
        uint256 tokenId
    ) external view returns (Metadata memory);

    function tokenURIRange(
        uint256 start,
        uint256 stop
    ) external view returns (string[] memory);

    function burn(uint256 tokenId) external;

    function burnByOwner(uint256 tokenId) external;
}
