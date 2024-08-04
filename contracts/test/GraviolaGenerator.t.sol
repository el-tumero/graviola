// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/src/Test.sol";
import {TGraviolaSeasonsCandidates} from "../src/Graviola/seasons/TGraviolaSeasonsCandidates.sol";
import {LocalMigration} from "../src/migrations/LocalMigration.sol";
import {GraviolaGenerator} from "../src/Graviola/GraviolaGenerator.sol";

contract GraviolaGeneratorTest is Test {
    LocalMigration public lm;

    GraviolaGenerator public generator;

    function setUp() public virtual {
        lm = new LocalMigration();
        lm.run();
        address[7] memory addresses = lm.getAddresses();

        generator = GraviolaGenerator(addresses[6]);
    }

    function test_Okay() external {
        generator.prepare();
    }
}
