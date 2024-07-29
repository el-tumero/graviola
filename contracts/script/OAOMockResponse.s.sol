// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/src/Script.sol";
import {Graviola} from "../src/Graviola/GraviolaMain.sol";
import {AIOracleMock} from "../src/OAO/AIOracleMock.sol";

contract GraviolaDeploy is Script {
    string constant response =
        "https://ipfs.io/ipfs/QmTjUY4rQLrgv8tjedXoXDmXRtahL1bcFVK64jnTkiVGEn";
    uint256 constant requestId = 0;
    address constant OAOAddress =
        address(0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512);

    function run() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        AIOracleMock oao = AIOracleMock(OAOAddress);
        oao.invokeCallback(requestId, bytes(response));

        vm.stopBroadcast();
    }
}
