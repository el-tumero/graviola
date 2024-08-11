// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Metadata} from "./GraviolaMetadata.sol";

interface IGraviolaCollection is IERC721 {
    function mint(address to) external returns (uint256);

    function createMetadata(uint256 tokenId, Metadata memory metadata) external;

    function addImage(uint256 tokenId, string memory image) external;

    function ownedTokens(
        address addr
    ) external view returns (uint256[] memory output);
}
