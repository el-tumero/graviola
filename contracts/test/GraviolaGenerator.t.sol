// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/src/Test.sol";
import {Migration} from "../src/migrations/Migration.sol";
import {LocalMigration} from "../src/migrations/LocalMigration.sol";
import {GraviolaGenerator} from "../src/Graviola/GraviolaGenerator.sol";
import {GraviolaCollection} from "../src/Graviola/GraviolaCollection.sol";

import {VRFV2PlusWrapperMock} from "../src/utils/VRFV2PlusWrapperMock.sol";
import {AIOracleMock} from "../src/OAO/AIOracleMock.sol";

/* solhint-disable */
contract GraviolaGeneratorTest is Test {
    LocalMigration public lm;

    VRFV2PlusWrapperMock public vrf;
    AIOracleMock public oao;
    GraviolaGenerator public generator;
    GraviolaCollection public collection;

    address private alice = makeAddr("alice");

    function setUp() public virtual {
        vm.deal(alice, 1 ether);

        lm = new LocalMigration();
        lm.deploy();
        lm.setup();

        vrf = VRFV2PlusWrapperMock(
            lm.getDeployedContractAddress(Migration.DeployedContract.VRF)
        );
        oao = AIOracleMock(
            lm.getDeployedContractAddress(Migration.DeployedContract.OAO)
        );
        generator = GraviolaGenerator(
            lm.getDeployedContractAddress(Migration.DeployedContract.GENERATOR)
        );
        collection = GraviolaCollection(
            lm.getDeployedContractAddress(Migration.DeployedContract.COLLECTION)
        );
    }

    function test_Prepare() external {
        vm.startPrank(alice);
        vm.expectEmit();
        emit GraviolaGenerator.RequestVRFSent(alice, 0);
        generator.prepare{value: 200000}();
    }

    function test_Generate() external {
        vm.startPrank(alice);
        generator.prepare{value: 200000}();

        vm.expectEmit();
        emit GraviolaGenerator.RequestVRFFulfilled(alice, 0);
        vrf.fulfillRandomWords(0);

        vm.expectEmit();
        emit GraviolaGenerator.RequestOAOSent(alice, 0);
        generator.generate(0);

        vm.expectEmit();
        emit GraviolaGenerator.RequestOAOFulfilled(alice, 0);
        oao.invokeNextCallback("test_img");
    }

    uint256[] tokensToBurn = [0, 1, 2];

    function test_TradeUp() external {
        vm.startPrank(alice);

        // generate three tokens
        for (uint256 i = 0; i < 3; i++) {
            generator.prepare{value: 200000}();
            vrf.fulfillRandomWords(i);
            generator.generate(i);
            oao.invokeNextCallback("test_img");
        }

        generator.prepare{value: 200000}();
        vrf.fulfillRandomWords(3);
        generator.tradeUp(3, tokensToBurn);
        oao.invokeNextCallback("test_img");
    }
}
