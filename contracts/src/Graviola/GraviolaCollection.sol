// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {GraviolaMetadata, Metadata} from "./GraviolaMetadata.sol";

contract GraviolaCollection is
    ERC721,
    ERC721Enumerable,
    ERC721Burnable,
    Ownable,
    GraviolaMetadata
{
    mapping(address => uint256[]) private _ownedTokens;

    uint256 private nextTokenId;

    event ImageAdded(uint256 tokenId, address tokenOwner);

    constructor(
        address ownerAddress,
        address archiveAddress
    )
        ERC721("GraviolaCollection", "GRVC")
        Ownable(ownerAddress)
        GraviolaMetadata(archiveAddress)
    {}

    function mint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function createMetadata(
        uint256 tokenId,
        Metadata memory metadata
    ) external onlyOwner {
        _createMetadata(tokenId, metadata);
    }

    function getMetadata(
        uint256 tokenId
    ) external view returns (Metadata memory) {
        return _getMetadata(tokenId);
    }

    function addImage(uint256 tokenId, string memory image) external onlyOwner {
        _addImage(tokenId, image);
        emit ImageAdded(tokenId, ownerOf(tokenId));
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        return _tokenURI(tokenId);
    }

    function burnByOwner(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
