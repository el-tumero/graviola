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


    uint256[100] votes = [uint256(255), 253, 251, 243, 241, 239, 238, 235, 234, 230, 230, 226, 224, 221, 219, 218, 216, 211, 210, 208, 208, 199, 198, 195, 193, 192, 192, 183, 179, 179, 178, 176, 166, 164, 159, 158, 155, 153, 150, 148, 144, 140, 139, 136, 133, 132, 130, 128, 125, 124, 124, 123, 118, 118, 118, 117, 116, 114, 114, 113, 113, 108, 106, 104, 103, 92, 88, 84, 82, 81, 81, 71, 68, 59, 58, 56, 56, 48, 46, 44, 30, 30, 28, 28, 27, 25, 24, 22, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8];

    function setUp() public virtual {
        gsa = new GraviolaSeasonsArchive(alice);
        gsg = new GraviolaSeasonsGovernor(address(gsa));
        vm.deal(alice, 1 ether);
    }

    function test_AddCandidate100NoGas() internal noGasMetering {
        vm.prank(alice);
        for (uint i = 1; i < 101; i++) {
            gsg.debugAddCandidate(i, votes[i-1]);
        } 
    }

    function test_Add6CandidatesNoGas() internal noGasMetering {
        for (uint i = 1; i < 7; i++) {
            gsg.addCandidate(i);
        } 
    }

    function print_array(uint256[] memory arr) internal noGasMetering {
        for (uint i = 0; i < arr.length; i++) {
            console.log(arr[i]);
        }
    }
    
    
    function test_UpvoteCandidate() external {
        vm.prank(alice);
        test_Add6CandidatesNoGas();
        
        for (uint i = 1; i < 6; i++) { // vote for 5 candidates
            gsg.upvoteCandidate(i, i*2);
        }
        
        expectedCandidates = [5, 4, 3, 2, 1];
        uint256[] memory top = gsg.getTopCandidates(gsg.getListSize());
        assertEq(expectedCandidates, top);

        gsg.upvoteCandidate(6, 1); // vote for 6th candidate
        top = gsg.getTopCandidates(gsg.getListSize());
        assertEq(expectedCandidates, top);
    }


    // function test_GetSortedSpot() external {
    //     test_AddCandidate100NoGas();
    //     uint spot = gsg.debugGetSortedSpot(241);
    //     console.log(spot);
    // }

    // function test_GetHead() external {
    //     test_AddCandidate100NoGas();
    //     (,uint256 head) = gsg.getHead();
    //     console.log(head);
    // }

    //  function test_GetTail() external {
    //     test_AddCandidate100NoGas();
    //     (,uint256 tail) = gsg.getTail();
    //     console.log(tail);
    // }


}