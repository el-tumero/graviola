// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

struct UpkeepInfo {
  address target;
  uint32 executeGas;
  bytes checkData;
  uint96 balance;
  address admin;
  uint64 maxValidBlocknumber;
  uint32 lastPerformBlockNumber;
  uint96 amountSpent;
  bool paused;
  bytes offchainConfig;
}

interface IKeeperRegistry {
    function getUpkeep(uint256 id) external view returns (UpkeepInfo memory upkeepInfo);
}