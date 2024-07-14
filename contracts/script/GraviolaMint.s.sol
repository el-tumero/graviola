// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/src/Script.sol";
import {Graviola} from "../src/Graviola/GraviolaMain.sol";

contract GraviolaMintScript is Script {
    address constant graviolaAddress =
        address(0x5b1869D9A4C187F2EAa108f3062412ecf0526b24);

    function run() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        Graviola graviola = Graviola(graviolaAddress);
        uint256 fee = graviola.estimateFee();
        graviola.mint{value: fee + 0.007 ether}();
        vm.stopBroadcast();
    }
}
