// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/src/Test.sol";
import {Graviola} from "../src/Graviola/GraviolaMain.sol";
import {AIOracleMock} from "../src/OAO/AIOracleMock.sol";


contract GraviolaTest is Test {
    Graviola public graviola;
    AIOracleMock public aiOracle;
    address constant alice = address(1);


    function setUp() public virtual {
        aiOracle = new AIOracleMock();
        graviola = new Graviola(address(aiOracle), address(0x0));
        vm.deal(alice, 1 ether);
    }

    function test_Mint() external {
        vm.prank(alice);
        graviola.mint{value: 0.006 ether}();

        aiOracle.invokeCallback(0, "image-cid");
        assertEq(graviola.ownerOf(0), alice);
        assertEq(graviola.getMetadata(0).image, "image-cid");
    }

    function test_TradeUp() external {
        for (uint i = 0; i < 3; i++) {
            vm.prank(alice);
            graviola.mint{value: 0.006 ether}();
            aiOracle.invokeCallback(i, "image-cid");
        }

        vm.prank(alice);
        graviola.tradeUp{value: 0.006 ether}([uint256(0), 1, 2]);

        aiOracle.invokeCallback(3, "image-cid-tradeup");

        assertEq(graviola.getMetadata(3).image, "image-cid-tradeup");
        assertEq(graviola.ownerOf(3), alice);
    }

}
