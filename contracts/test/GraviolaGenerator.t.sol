// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/src/Test.sol";
import {LocalMigration} from "../src/migrations/LocalMigration.sol";
import {GraviolaGenerator} from "../src/Graviola/GraviolaGenerator.sol";
import {VRFV2PlusWrapperMock} from "../src/utils/VRFV2PlusWrapperMock.sol";

contract GraviolaGeneratorTest is Test {
    LocalMigration public lm;

    VRFV2PlusWrapperMock public vrf;
    GraviolaGenerator public generator;

    address private alice = makeAddr("alice");

    function setUp() public virtual {
        vm.deal(alice, 1 ether);
        console.log(alice);

        lm = new LocalMigration();
        lm.run();
        address[7] memory addresses = lm.getAddresses();

        vrf = VRFV2PlusWrapperMock(addresses[0]);
        generator = GraviolaGenerator(addresses[6]);
    }

    function test_Prepare() external {
        vm.expectEmit();
        emit GraviolaGenerator.RequestVRFSent(0);
        generator.prepare{value: 200000}();
    }

    function test_Generate() external {
        vm.startPrank(alice);
        generator.prepare{value: 200000}();
        // vm.expectEmit();
        // emit GraviolaGenerator.RequestVRFFulfilled(0);
        vrf.fulfillRandomWords(0);
        generator.generate(0);
    }
}
