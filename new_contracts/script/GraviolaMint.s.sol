// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/src/Script.sol";
import {Graviola} from "../src/Graviola/Graviola.sol";

contract GraviolaMintScript is Script {
    function run() public {
        address graviolaAddress = vm.envAddress("GRAVIOLA_ADDRESS");

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        Graviola graviola = Graviola(graviolaAddress);
        uint256 fee = graviola.estimateFee();
        graviola.mint{value: fee + 0.007 ether}();
        vm.stopBroadcast();
    }
}