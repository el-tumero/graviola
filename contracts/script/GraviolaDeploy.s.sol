// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/src/Script.sol";
import {Graviola} from "../src/Graviola/Graviola.sol";
import {AIOracleMock} from "../src/OAO/AIOracleMock.sol";


contract GraviolaDeploy is Script {
    function run() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        AIOracleMock oao = new AIOracleMock();
        Graviola graviola = new Graviola(address(oao), address(1));

        console.log("OAO address:");
        console.log(address(oao));
        console.log("Graviola address:");
        console.log(address(graviola));
        
        vm.stopBroadcast();
    }
}