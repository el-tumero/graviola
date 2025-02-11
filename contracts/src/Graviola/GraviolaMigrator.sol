// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {VRFV2PlusWrapperMock} from "../utils/VRFV2PlusWrapperMock.sol";
import {AIOracleMock} from "../OAO/AIOracleMock.sol";
import {GraviolaKeywordsVaultBasic} from "./GraviolaKeywordsVaultBasic.sol";
import {GraviolaCollection} from "./GraviolaCollection.sol";
import {GraviolaGenerator} from "./GraviolaGenerator.sol";
import {GraviolaCollectionReadProxy} from "./GraviolaCollectionReadProxy.sol";
import {GraviolaSchema} from "./GraviolaSchema.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract GraviolaMigrator is Ownable {
    enum DeployedContract {
        VRF,
        OAO,
        COLLECTION,
        KEYWORDS_VAULT,
        GENERATOR,
        COLLECTION_READ_PROXY,
        MIGRATOR,
        SCHEMA
    }

    mapping(DeployedContract => address) internal addresses;

    address internal migrator = address(this);

    VRFV2PlusWrapperMock public vrf;
    AIOracleMock public oao;
    GraviolaCollection public collection;
    GraviolaKeywordsVaultBasic public keywordsVault;
    GraviolaGenerator public generator;
    GraviolaCollectionReadProxy public collectionReadProxy;
    GraviolaSchema public schema;

    constructor() Ownable(msg.sender) {}

    function setup() external {
        generator = GraviolaGenerator(addresses[DeployedContract.GENERATOR]);
        schema = GraviolaSchema(addresses[DeployedContract.SCHEMA]);
        collection = GraviolaCollection(addresses[DeployedContract.COLLECTION]);

        collection.setGenerator(address(generator));
        collection.setSchema(address(schema));
    }

    function getDeployedContractAddress(
        DeployedContract c
    ) external view returns (address) {
        return addresses[c];
    }

    function addDeployedContractAddress(
        DeployedContract c,
        address contractAddress
    ) external onlyOwner {
        addresses[c] = address(contractAddress);
    }
}
