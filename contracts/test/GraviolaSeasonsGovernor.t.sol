// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/src/Test.sol";
import {GraviolaSeasonsGovernor} from "../src/Graviola/seasons/GraviolaSeasonsGovernor.sol";
import {GraviolaSeasonsArchive} from "../src/Graviola/seasons/GraviolaSeasonsArchive.sol";
import {GraviolaSeasonsCandidates} from "../src/Graviola/seasons/GraviolaSeasonsCandidates.sol";


contract GraviolaSeasonsGovernorTest is Test {
    GraviolaSeasonsArchive public gsa;
    GraviolaSeasonsGovernor public gsg;
    address constant alice = address(1);
    uint256[] expectedCandidates;


    uint256[100] votes = [uint256(255), 253, 251, 243, 241, 239, 238, 235, 234, 230, 230, 226, 224, 221, 219, 218, 216, 211, 210, 208, 208, 199, 198, 195, 193, 192, 192, 183, 179, 179, 178, 176, 166, 164, 159, 158, 155, 153, 150, 148, 144, 140, 139, 136, 133, 132, 130, 128, 125, 124, 124, 123, 118, 118, 118, 117, 116, 114, 114, 113, 113, 108, 106, 104, 103, 92, 88, 84, 82, 81, 81, 71, 68, 59, 58, 56, 56, 48, 46, 44, 30, 30, 28, 28, 27, 25, 24, 22, 19, 18, 17, 16, 16, 11, 10, 9, 8, 5, 4, 1];

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
        (, uint256 prev, uint256 next) = gsg.debugGetNode(320);
        console.log("debugGetNode 320:");
        console.log(next); // 0
        console.log(prev); // 420
        (, prev, next) = gsg.debugGetNode(420);
        console.log("debugGetNode 420:");
        console.log(next); // 320
        console.log(prev); // 255
        (, prev, next) = gsg.debugGetNode(255);
        console.log("debugGetNode 255:");
        console.log(next); // 420
        console.log(prev); // 0
    }

    // function test_VoteForCandidateNoMove() external {
    //     test_AddCandidateNoGas();
    //     gsg.voteForCandidateNoMove(320, 2);
    //     gsg.voteForCandidateNoMove(420, 2);
    //     gsg.voteForCandidateNoMove(255, 2);

    //     vm.expectRevert(abi.encodeWithSelector(GraviolaSeasonsCandidates.VoteNotAllowed.selector, 1));
    //     gsg.voteForCandidateNoMove(255, 100);

    //     vm.expectRevert(abi.encodeWithSelector(GraviolaSeasonsCandidates.VoteNotAllowed.selector, 2));
    //     gsg.voteForCandidateNoMove(420, 100);


    // }

    function test_VoteForCandidate() external {
        test_AddCandidateNoGas();
        gsg.voteForCandidate(255, 40);
        expectedCandidates = [255, 320, 420];        
        assertEq(gsg.getCandidates(), expectedCandidates);
    }


    function test_AddCandidate100NoGas() internal noGasMetering {
        vm.prank(alice);
        for (uint i = 1; i < 101; i++) {
            gsg.addCandidate(i, votes[i-1]);
        }
        
    }

    function test_VoteForCandidate2() external {
        
    }

}

