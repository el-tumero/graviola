// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract GraviolaNonFungible is ERC721 {

    // mapping for tokens owned by address (user)
    mapping(address => uint256[]) private _ownedTokens;

    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address previousOwner = super._update(to, tokenId, auth);

        if(to != address(0)) _ownedTokens[to].push(tokenId);
        return previousOwner;
    }

    function ownedTokens(address addr) public view returns (uint256[] memory output){
        uint256[] memory buffer = new uint256[](_ownedTokens[addr].length);
        uint256 j = 0;
        for (uint i = 0; i < _ownedTokens[addr].length; i++) {
            uint256 tokenId = _ownedTokens[addr][i];
            if(_ownerOf(tokenId) == addr){
                buffer[j] = tokenId;
                j++;
            }
        }
        output = new uint256[](j);
        for (uint i = 0; i < j; i++) {
            output[i] = buffer[i];
        }
    }

}