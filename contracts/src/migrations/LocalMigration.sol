// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Graviola} from "../Graviola/GraviolaMain.sol";
import {AIOracleMock} from "../OAO/AIOracleMock.sol";
import {GraviolaToken} from "../Graviola/GraviolaToken.sol";
import {GraviolaSeasonsArchive} from "../Graviola/seasons/GraviolaSeasonsArchive.sol";
import {TGraviolaSeasonsGovernor} from "../Graviola/seasons/TGraviolaSeasonsGovernor.sol";

contract LocalMigration {
    uint256 constant NUMBER_OF_CONTRACTS = 5;

    string[NUMBER_OF_CONTRACTS] private names = [
        "GRAVIOLA",
        "OAO",
        "TOKEN",
        "SEASONS_ARCHIVE",
        "SEASONS_GOVERNOR"
    ];

    AIOracleMock private oao;
    Graviola private graviola;
    GraviolaToken private gt;
    GraviolaSeasonsArchive private gsa;
    TGraviolaSeasonsGovernor private gsg;

    function run() external {
        oao = new AIOracleMock();
        graviola = new Graviola(address(oao), address(1));

        gt = new GraviolaToken(msg.sender);

        gsa = new GraviolaSeasonsArchive(msg.sender);
        gsg = new TGraviolaSeasonsGovernor(address(gsa), address(gt));

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
            address(graviola),
            address(oao),
            address(gt),
            address(gsa),
            address(gsg)
        ];
    }
}
