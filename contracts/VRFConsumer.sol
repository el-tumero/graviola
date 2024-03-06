// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./VRFHostConsumerInterface.sol";

contract VRFConsumer{
    VRFHostConsumerInterface public host;
    uint256 private height = 0;
    mapping(uint256 => uint32) internal refs; // id -> round

    uint32 constant WAIT_ROUNDS = 2;

    constructor(address _VRFHostAddress){
        host = VRFHostConsumerInterface(_VRFHostAddress);
    }

    function saveRandomValue() public returns(uint256) {
        refs[height] = host.getCurrentRoundId() + WAIT_ROUNDS;
        return height++;
    }

    function getRefValue(uint256 _id) public view returns(uint256) {
        return refs[_id];
    }

    function isRandomValueReady(uint256 refId) public view returns(bool) {
        if(refs[refId] == 0) return false;
        VRFHostConsumerInterface.Round memory round = host.getRound(refs[refId]);
        if(round.state != VRFHostConsumerInterface.RoundState.FINAL) return false;
        return true;
    }

    
    function readRandomValue(uint256 refId) public view returns(uint256) {
        require(refs[refId] != 0, "Empty ref!");
        VRFHostConsumerInterface.Round memory round = host.getRound(refs[refId]);
        require(round.state == VRFHostConsumerInterface.RoundState.FINAL, "Round not finalized!");
        return round.randomNumber;
    }

}
