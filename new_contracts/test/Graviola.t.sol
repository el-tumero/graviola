// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/src/Test.sol";
import {Graviola} from "../src/Graviola/Graviola.sol";
import {AIOracleMock} from "../src/OAO/AIOracleMock.sol";


contract GraviolaTest is Test {
    Graviola public graviola;
    AIOracleMock public aiOracle;

    function setUp() public virtual {
        aiOracle = new AIOracleMock();
        graviola = new Graviola(address(aiOracle), address(0x0));
    }

    function test_Mint() external {
        graviola.mint{value: 0.006 ether}(address(1));
        aiOracle.invokeCallback(0, "image-cid");
        assertEq(graviola.ownerOf(0), address(1));
        assertEq(graviola.getMetadata(0).image, "image-cid");
    }

    function test_TradeUp() external {
        for (uint i = 0; i < 3; i++) {
            graviola.mint{value: 0.006 ether}(address(1));
            aiOracle.invokeCallback(i, "image-cid");
        }

        hoax(address(1), 1 ether);
        graviola.tradeUp{value: 0.006 ether}([uint256(0), 1, 2]);

        aiOracle.invokeCallback(3, "image-cid-tradeup");

        assertEq(graviola.getMetadata(3).image, "image-cid-tradeup");
        assertEq(graviola.ownerOf(3), address(1));
    }

}
