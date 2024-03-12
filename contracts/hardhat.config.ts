import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config'

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      }
    }
  },
  networks: {
    // hardhat: {
    //   forking: {
    //     url: process.env.RPC_URL as string,
    //     enabled: true,
    //     blockNumber: 5402075
    //   },
    //   accounts: [{privateKey: process.env.PRIV_KEY as string, balance: "479000000000000000"}]
    // },
    sepolia: {
      url: process.env.RPC_URL as string,
      accounts: [process.env.PRIV_KEY as string]
    }
  }
};

export default config;
