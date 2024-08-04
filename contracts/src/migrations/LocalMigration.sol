// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GraviolaGenerator} from "../Graviola/GraviolaGenerator.sol";
import {AIOracleMock} from "../OAO/AIOracleMock.sol";
import {GraviolaToken} from "../Graviola/GraviolaToken.sol";
import {GraviolaSeasonsArchive} from "../Graviola/seasons/GraviolaSeasonsArchive.sol";
import {TGraviolaSeasonsGovernor} from "../Graviola/seasons/TGraviolaSeasonsGovernor.sol";
import {VRFV2PlusWrapperMock} from "../utils/VRFV2PlusWrapperMock.sol";
import {GraviolaCollection} from "../Graviola/GraviolaCollection.sol";

contract LocalMigration {
    uint256 constant NUMBER_OF_CONTRACTS = 7;

    string[NUMBER_OF_CONTRACTS] private names = [
        "VRF",
        "OAO",
        "TOKEN",
        "COLLECTION",
        "SEASONS_ARCHIVE",
        "SEASONS_GOVERNOR"
        "GENERATOR"
    ];

    VRFV2PlusWrapperMock private vrf;

    AIOracleMock private oao;
    GraviolaToken private gt;
    GraviolaCollection private collection;
    GraviolaSeasonsArchive private gsa;
    TGraviolaSeasonsGovernor private gsg;
    GraviolaGenerator private generator;

    function run() external {
        vrf = new VRFV2PlusWrapperMock();
        oao = new AIOracleMock();
        gt = new GraviolaToken(msg.sender);
        gsa = new GraviolaSeasonsArchive(msg.sender);
        gsg = new TGraviolaSeasonsGovernor(address(gsa), address(gt));

        generator = new GraviolaGenerator(
            address(gt),
            address(gsa),
            address(collection),
            address(oao),
            address(vrf)
        );

        for (uint i = 1; i < 100; i++) {
            gsg.addAndUpvote(i);
        }
    }

    function getNames()
        external
        view
        returns (string[NUMBER_OF_CONTRACTS] memory)
    {
        return names;
    }

    function getAddresses()
        external
        view
        returns (address[NUMBER_OF_CONTRACTS] memory)
    {
        return [
            address(vrf),
            address(oao),
            address(gt),
            address(collection),
            address(gsa),
            address(gsg),
            address(generator)
        ];
    }
}
