// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GraviolaCollection} from "./GraviolaCollection.sol";

contract GraviolaCollectionReadProxy {
    GraviolaCollection public collection;

    constructor(address collectionAddress) {
        collection = GraviolaCollection(collectionAddress);
    }

    function tokenRange(
        uint256 start,
        uint256 stop
    ) external view returns (uint256[] memory, string[] memory) {
        uint256[] memory ids = new uint256[](stop - start);
        string[] memory uris = new string[](stop - start);

        for (uint256 i = start; i < stop; i++) {
            uint256 tokenId = collection.tokenByIndex(i);
            string memory uri = collection.tokenURI(tokenId);
            ids[i - start] = tokenId;
            uris[i - start] = uri;
        }
        return (ids, uris);
    }

    function tokenOfOwnerRange(
        address owner,
        uint256 start,
        uint256 stop
    ) external view returns (uint256[] memory, string[] memory) {
        uint256[] memory ids = new uint256[](stop - start);
        string[] memory uris = new string[](stop - start);

        for (uint256 i = start; i < stop; i++) {
            uint256 tokenId = collection.tokenOfOwnerByIndex(owner, i);
            string memory uri = collection.tokenURI(tokenId);
            ids[i - start] = tokenId;
            uris[i - start] = uri;
        }
        return (ids, uris);
    }
}
