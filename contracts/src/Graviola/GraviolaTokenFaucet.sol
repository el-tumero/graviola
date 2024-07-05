// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GraviolaTokenFaucet {
    IERC20 private graviolaToken;

    function setToken(address tokenAddress) external {
        graviolaToken = IERC20(tokenAddress);
    }

    function withdraw(uint256 amount) external {
        graviolaToken.transfer(msg.sender, amount);
    }
}