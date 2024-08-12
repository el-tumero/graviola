// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {GraviolaMetadata, Metadata} from "./GraviolaMetadata.sol";

contract GraviolaCollection is ERC721, Ownable, GraviolaMetadata {
    mapping(address => uint256[]) private _ownedTokens;

    uint256 private nextTokenId;

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

    function addImage(uint256 tokenId, string memory image) external onlyOwner {
        _addImage(tokenId, image);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address previousOwner = super._update(to, tokenId, auth);

        if (to != address(0)) _ownedTokens[to].push(tokenId);
        return previousOwner;
    }

    function ownedTokens(
        address addr
    ) external view returns (uint256[] memory) {
        uint256[] memory buffer = new uint256[](_ownedTokens[addr].length);
        uint256 j = 0;
        for (uint256 i = 0; i < _ownedTokens[addr].length; i++) {
            uint256 tokenId = _ownedTokens[addr][i];
            if (_ownerOf(tokenId) == addr) {
                buffer[j] = tokenId;
                j++;
            }
        }

        uint256[] memory output = new uint256[](j);
        for (uint256 i = 0; i < j; i++) {
            output[i] = buffer[i];
        }
        return output;
    }
}
