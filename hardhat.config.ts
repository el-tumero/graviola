import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config'

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: process.env.RPC_URL as string,
        enabled: true,
        blockNumber: 5402075
      },
      accounts: [{privateKey: process.env.PRIV_KEY as string, balance: "479000000000000000"}]
    }
  }
};

export default config;
