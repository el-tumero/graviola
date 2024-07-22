// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/src/Script.sol";
import {Graviola} from "../src/Graviola/GraviolaMain.sol";
import {AIOracleMock} from "../src/OAO/AIOracleMock.sol";
import {GraviolaToken} from "../src/Graviola/GraviolaToken.sol";
import {GraviolaSeasonsArchive} from "../src/Graviola/seasons/GraviolaSeasonsArchive.sol";
import {GraviolaSeasonsGovernor} from "../src/Graviola/seasons/GraviolaSeasonsGovernor.sol";



contract GraviolaDeploy is Script {
    function run() public {
        vm.startBroadcast();
        AIOracleMock oao = new AIOracleMock();
        Graviola graviola = new Graviola(address(oao), address(1));

        GraviolaToken gt = new GraviolaToken(msg.sender);

        GraviolaSeasonsArchive gsa = new GraviolaSeasonsArchive(msg.sender);
        GraviolaSeasonsGovernor gsg = new GraviolaSeasonsGovernor(address(gsa), address(gt));
        
        console.log("GRAVIOLA_ADDRESS:%s", address(graviola));
        console.log("OAO_ADDRESS:%s", address(oao));
        console.log("TOKEN_ADDRESS:%s", address(gt));
        console.log("SEASONS_ARCHIVE_ADDRESS:%s", address(gsa));
        console.log("SEASONS_GOVERNOR_ADDRESS:%s", address(gsg));
        console.log(gt.balanceOf(msg.sender));

        vm.stopBroadcast();
    }
}
