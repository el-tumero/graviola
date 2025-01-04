// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @dev Required interface of an ERC7007 compliant contract.
 * Note: the ERC-165 identifier for this interface is 0x702c55a6.
 */
interface IERC7007 is IERC165, IERC721 {
    /**
     * @dev Emitted when `tokenId` token's AIGC data is added.
     */
    event AigcData(
        uint256 indexed tokenId,
        bytes indexed prompt,
        bytes indexed aigcData,
        bytes proof
    );

    /**
     * @dev Add AIGC data to token at `tokenId` given `prompt`, `aigcData`, and `proof`.
     */
    function addAigcData(
        uint256 tokenId,
        bytes calldata prompt,
        bytes calldata aigcData,
        bytes calldata proof
    ) external;

    /**
     * @dev Verify the `prompt`, `aigcData`, and `proof`.
     */
    function verify(
        bytes calldata prompt,
        bytes calldata aigcData,
        bytes calldata proof
    ) external view returns (bool success);
}
