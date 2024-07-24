import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-foundry"

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        hardhat: {
            blockGasLimit: 300_000_000,
        },
    },
}

export default config
