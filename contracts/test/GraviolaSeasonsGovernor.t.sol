// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/src/Test.sol";
import {GraviolaSeasonsArchive} from "../src/Graviola/seasons/GraviolaSeasonsArchive.sol";
import {GraviolaToken} from "../src/Graviola/GraviolaToken.sol";
import {GraviolaTokenFaucet} from "../src/Graviola/GraviolaTokenFaucet.sol";
import {GraviolaSeasonsGovernor} from "../src/Graviola/seasons/GraviolaSeasonsGovernor.sol";
import {CandidateExternal} from "../src/Graviola/seasons/IGraviolaSeasonsGovernor.sol";


contract GraviolaTest is Test {
    GraviolaSeasonsArchive public gsa;
    GraviolaToken public gt;
    GraviolaTokenFaucet public gtf;
    GraviolaSeasonsGovernor public gsg;
    address constant alice = address(1);

    string[] words = [
        "limping",
        "harm",
        "frequent",
        "remove",
        "acceptable",
        "moldy",
        "serious",
        "earthy",
        "efficacious",
        "minor",
        "cheap",
        "two"
    ];

    function setUp() public virtual {
        gsa = new GraviolaSeasonsArchive(alice);
        gtf = new GraviolaTokenFaucet();
        gt = new GraviolaToken(address(gtf));
        gtf.setToken(address(gt));
        gsg = new GraviolaSeasonsGovernor(address(gsa), address(gt));
        vm.deal(alice, 1 ether);
    }

    function setup_Votes() internal noGasMetering {
        vm.startPrank(alice);
        gtf.withdraw(1000);
        gt.delegate(alice);
        vm.stopPrank();
        gsg.snapshot();
        vm.warp(1000);
    }

    function bytesToUint256(
        bytes memory _bytes
    ) internal pure returns (uint256) {
        uint256 tempUint;
        assembly {
            tempUint := mload(add(add(_bytes, 0x20), 0))
        }
        return tempUint;
    }

    function uint256ToBytes(uint256 n) internal pure returns (bytes memory) {
        bytes memory b = new bytes(32);
        assembly {
            mstore(add(b, 32), n)
        }
        return b;
    }

    function setup_AddCandidates() internal noGasMetering {
        for (uint i = 0; i < 10; i++) {
            // uint256 len = bytes(words[i]).length;
            // console.log(len);
            uint256 word = bytesToUint256(bytes(words[i]));
            // console.logBytes(uint256ToBytes(word));
            // string memory wordStr = string(uint256ToBytes(word, len));
            // console.log(wordStr);
            // console.log(bytes(wordStr).length);
            gsg.addCandidate(word);
        }
    }

    function test_upvoteCandidate() external {
        setup_Votes();
        setup_AddCandidates();

        uint256 word = bytesToUint256(bytes(words[2]));

        vm.prank(alice);
        gsg.upvoteCandidate(word);

        CandidateExternal memory top = gsg
            .getTopCandidatesInfo(1)[0];
        assertEq(top.id, word);
        assertEq(top.score, 1000);
    }
}
