// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Metadata} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {GraviolaMetadata} from "./GraviolaMetadata.sol";
import {GraviolaEnumerable} from "./GraviolaEnumerable.sol";
import {GraviolaSchema} from "./GraviolaSchema.sol";
import {GraviolaGenerator} from "./GraviolaGenerator.sol";
import {IERC7007} from "../OAO/IERC7007.sol";
import {IAIOracle} from "../OAO/IAIOracle.sol";

contract GraviolaCollection is
    ERC165,
    ERC721,
    ERC721Enumerable,
    ERC721Burnable,
    IERC7007,
    Ownable,
    GraviolaMetadata,
    GraviolaEnumerable
{
    error NotGenerator();
    error NonExistentToken(uint256 tokenId);

    GraviolaSchema public schema;
    GraviolaGenerator public generator;
    IAIOracle public aiOracle;

    mapping(uint256 => uint256) private oaoRequestIds;

    constructor(
        address ownerAddress,
        address aiOracleAddress
    )
        ERC721("GraviolaCollection", "GRVC")
        Ownable(ownerAddress)
        GraviolaMetadata()
    {
        aiOracle = IAIOracle(aiOracleAddress);
    }

    modifier onlyGenerator() {
        if (address(generator) != msg.sender) {
            revert NotGenerator();
        }
        _;
    }

    function setGenerator(address generatorAddress) external onlyOwner {
        generator = GraviolaGenerator(generatorAddress);
    }

    function setSchema(address schemaAddress) external onlyOwner {
        schema = GraviolaSchema(schemaAddress);
    }

    function setAIOracle(address aiOracleAddress) external onlyOwner {
        aiOracle = IAIOracle(aiOracleAddress);
    }

    function mint(uint256 tokenId, address to) external onlyGenerator {
        _safeMint(to, tokenId);
    }

    // == Metadata/Properties and ERC7007 related functions ==

    function addProperty(
        uint256 tokenId,
        bytes32 property,
        bytes calldata value
    ) external onlyGenerator {
        _addProperty(tokenId, property, value);
    }

    function readProperty(
        uint256 tokenId,
        bytes32 property
    ) external view returns (bytes memory) {
        return _readProperty(tokenId, property);
    }

    function addAigcData(
        uint256 tokenId,
        bytes calldata prompt,
        bytes calldata aigcData,
        bytes calldata proof
    ) external onlyGenerator {
        if (ownerOf(tokenId) == address(0)) {
            revert NonExistentToken(tokenId);
        }
        _addAigcData(tokenId, prompt, aigcData);
        emit AigcData(tokenId, prompt, aigcData, proof);
    }

    function addOaoRequestId(
        uint256 tokenId,
        uint256 oaoRequestId
    ) external onlyGenerator {
        oaoRequestIds[tokenId] = oaoRequestId;
    }

    function getOaoRequestId(uint256 tokenId) external view returns (uint256) {
        return oaoRequestIds[tokenId];
    }

    function verify(
        bytes calldata prompt,
        bytes calldata aigcData,
        bytes calldata /*proof*/
    ) external view returns (bool) {
        uint256 id = tokenId[prompt];
        return
            aiOracle.isFinalized(oaoRequestIds[id]) &&
            (keccak256(_readProperty(id, "image")) == keccak256(aigcData));
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        bytes32[] memory availableProperties = schema.getAvailableProperties();
        bytes[] memory propertyValues = new bytes[](availableProperties.length);
        for (uint256 i = 0; i < availableProperties.length; i++) {
            propertyValues[i] = _readProperty(tokenId, availableProperties[i]);
        }
        return schema.tokenURI(tokenId, propertyValues);
    }
    // == Overrides ==

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

    // TODO: check if is valid?
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC165, ERC721, IERC165, ERC721Enumerable)
        returns (bool)
    {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
