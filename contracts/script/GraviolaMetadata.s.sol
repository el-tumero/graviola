// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/src/Script.sol";
import {Graviola} from "../src/Graviola/Graviola.sol";
import {Metadata} from "../src/Graviola/GraviolaMetadata.sol";


contract GraviolaMetadataScript is Script {
    function run() public view {
        address graviolaAddress = vm.envAddress("GRAVIOLA_ADDRESS");
        Graviola graviola = Graviola(graviolaAddress);
        uint256 id = 0;
        Metadata memory metadata = graviola.getMetadata(id);
        console.log(metadata.prompt);
    }
}