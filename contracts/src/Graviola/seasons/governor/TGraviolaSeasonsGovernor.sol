// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IGraviolaSeasonsGovernor} from "./IGraviolaSeasonsGovernor.sol";
import {GraviolaSeasonsGovernor} from "./GraviolaSeasonsGovernor.sol";

contract TGraviolaSeasonsGovernor is
    IGraviolaSeasonsGovernor,
    GraviolaSeasonsGovernor
{
    constructor(
        address archiveAddress,
        address tokenAddress
    ) GraviolaSeasonsGovernor(archiveAddress, tokenAddress) {}

    function addAndUpvote(uint256 id) external {
        _addCandidate(id);
        _upvoteCandidate(id, id);
    }
}
