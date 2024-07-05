// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/src/Test.sol";
import {GraviolaToken} from "../src/Graviola/GraviolaToken.sol";
import {GraviolaTokenFaucet} from "../src/Graviola/GraviolaTokenFaucet.sol";

contract GraviolaTokenTest is Test {
    GraviolaTokenFaucet public gtf;
    GraviolaToken public gt;
    address constant alice = address(1);
    address constant bob = address(2);

    function setUp() public virtual {
        gtf = new GraviolaTokenFaucet();
        gt = new GraviolaToken(address(gtf));
        gtf.setToken(address(gt));
        vm.deal(alice, 1 ether);
    }

    function test_BalanceOf() external view {
        assertEq(gt.balanceOf(address(gtf)), 1000000000000000000000000);
    }

    function test_getVotes() external {
        vm.prank(alice);
        gtf.withdraw(1000);
        assertEq(gt.balanceOf(alice), 1000);

        vm.prank(alice);
        gt.delegate(alice);

        assertEq(gt.getVotes(alice), 1000);

        vm.warp(1000);
        vm.prank(alice);
        gt.transfer(bob, 100);

        assertEq(gt.getVotes(alice), 900);
    }

    function test_GetPastVotes() external {
        vm.startPrank(alice);
        gtf.withdraw(1000);
        gt.delegate(alice);

        vm.warp(1000);
        gt.transfer(bob, 100);

        assertEq(gt.getPastVotes(alice, 500), 1000);
        assertEq(gt.getVotes(alice), 900);

        vm.stopPrank();
    }




}