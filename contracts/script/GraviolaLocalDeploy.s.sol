// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/src/Script.sol";
import {Graviola} from "../src/Graviola/GraviolaMain.sol";
import {AIOracleMock} from "../src/OAO/AIOracleMock.sol";
import {GraviolaToken} from "../src/Graviola/GraviolaToken.sol";
import {GraviolaSeasonsArchive} from "../src/Graviola/seasons/GraviolaSeasonsArchive.sol";
import {TGraviolaSeasonsGovernor} from "../src/Graviola/seasons/TGraviolaSeasonsGovernor.sol";

contract GraviolaLocalDeploy is Script {
    function run() public {
        vm.startBroadcast();
        AIOracleMock oao = new AIOracleMock();
        Graviola graviola = new Graviola(address(oao), address(1));

        GraviolaToken gt = new GraviolaToken(msg.sender);

        GraviolaSeasonsArchive gsa = new GraviolaSeasonsArchive(msg.sender);
        TGraviolaSeasonsGovernor gsg = new TGraviolaSeasonsGovernor(
            address(gsa),
            address(gt)
        );

        for (uint i = 1; i < 100; i++) {
            gsg.addAndUpvote(i);
        }

        console.log("GRAVIOLA_ADDRESS:%s", address(graviola));
        console.log("OAO_ADDRESS:%s", address(oao));
        console.log("TOKEN_ADDRESS:%s", address(gt));
        console.log("SEASONS_ARCHIVE_ADDRESS:%s", address(gsa));
        console.log("SEASONS_GOVERNOR_ADDRESS:%s", address(gsg));

        vm.stopBroadcast();
    }
}
