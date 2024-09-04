// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GraviolaGenerator} from "../Graviola/GraviolaGenerator.sol";
import {AIOracleMock} from "../OAO/AIOracleMock.sol";
import {GraviolaToken} from "../Graviola/GraviolaToken.sol";
import {GraviolaSeasonsArchive} from "../Graviola/seasons/archive/GraviolaSeasonsArchive.sol";
import {TGraviolaSeasonsGovernor} from "../Graviola/seasons/governor/TGraviolaSeasonsGovernor.sol";
import {VRFV2PlusWrapperMock} from "../utils/VRFV2PlusWrapperMock.sol";
import {GraviolaCollection} from "../Graviola/GraviolaCollection.sol";
import {Migration} from "./Migration.sol";

contract LocalMigration is Migration {
    constructor() Migration() {}

    function deploy() external {
        vrf = new VRFV2PlusWrapperMock();
        oao = new AIOracleMock();
        gt = new GraviolaToken(msg.sender);
        gsa = new GraviolaSeasonsArchive(migrator);
        gsg = new TGraviolaSeasonsGovernor(address(gsa), address(gt));
        collection = new GraviolaCollection(migrator);
        generator = new GraviolaGenerator(
            address(gt),
            address(gsa),
            address(collection),
            address(oao),
            address(vrf)
        );

        addresses[DeployedContract.VRF] = address(vrf);
        addresses[DeployedContract.OAO] = address(oao);
        addresses[DeployedContract.TOKEN] = address(gt);
        addresses[DeployedContract.SEASONS_ARCHIVE] = address(gsa);
        addresses[DeployedContract.SEASONS_GOVERNOR] = address(gsg);
        addresses[DeployedContract.COLLECTION] = address(collection);
        addresses[DeployedContract.GENERATOR] = address(generator);
    }
}
