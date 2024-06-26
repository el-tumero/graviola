// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/src/Test.sol";
import {GraviolaSeasonsGovernor} from "../src/Graviola/seasons/GraviolaSeasonsGovernor.sol";
import {GraviolaSeasonsArchive} from "../src/Graviola/seasons/GraviolaSeasonsArchive.sol";



contract GraviolaSeasonsGovernorTest is Test {
    GraviolaSeasonsArchive public gsa;
    GraviolaSeasonsGovernor public gsg;
    address constant alice = address(1);
    uint256[] expectedCandidates;


    function setUp() public virtual {
        gsa = new GraviolaSeasonsArchive(alice);
        gsg = new GraviolaSeasonsGovernor(address(gsa));
        vm.deal(alice, 1 ether);
    }

  
    function test_AddCandidate() public {
        vm.prank(alice);
        gsg.addCandidate(255, 10);
        assertEq(gsg.getCandidate(255), true);
        gsg.addCandidate(320, 30);
        assertEq(gsg.getCandidate(320), true);
        gsg.addCandidate(420, 25);
        assertEq(gsg.getCandidate(420), true);

        expectedCandidates = [320, 420, 255];

        assertEq(gsg.getCandidates(), expectedCandidates);
    }

    function test_AddCandidateNoGas() internal noGasMetering {
        return test_AddCandidate();
    }


    function test_DebugGetNode() external {
        test_AddCandidateNoGas();
        (, uint256 prev, uint256 next) = gsg.debugGetNode(420);
        console.log("debugGetNode 420:");
        console.log(prev); // 255
        console.log(next); // 320
        (, prev, next) = gsg.debugGetNode(320);
        console.log("debugGetNode 320:");
        console.log(prev); // 420
        console.log(next); // 0
    }

    function test_VoteForCandidateNoMove() external {
        test_AddCandidateNoGas();
        gsg.voteForCandidateNoMove(320, 5);
    }

    function test_VoteForCandidate() external {
        test_AddCandidateNoGas();
        gsg.voteForCandidate(255, 40);
        expectedCandidates = [255, 320, 420];        
        assertEq(gsg.getCandidates(), expectedCandidates);
    }


    // function test_AddCandidate100AndVote() external {
    //     vm.prank(alice);
    //     for (uint i = 1; i < 100; i++) {
    //         gsg.addCandidate(i, i);
    //     }
        
    // }

}

