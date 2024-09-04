import 'dotenv/config'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-solhint'
import '@nomicfoundation/hardhat-verify'

const PRIVATE_KEY = process.env.PRIVATE_KEY
const API_KEY_INFURA = process.env.API_KEY_INFURA
const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY

const config: HardhatUserConfig = {
    networks: {
        hardhat: {
            blockGasLimit: 300_000_000,
            allowUnlimitedContractSize: true,
            forking: {
                enabled: false,
                url: `https://arbitrum-sepolia.infura.io/v3/${API_KEY_INFURA}`,
                blockNumber: 71109865,
            },
        },
        arbitrumSepolia: {
            url: `https://arbitrum-sepolia.infura.io/v3/${API_KEY_INFURA}`,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined,
        },
    },
    etherscan: {
        apiKey: {
            arbitrumSepolia: ARBISCAN_API_KEY ?? '',
        },
    },
    solidity: {
        version: '0.8.24',
    },
    paths: {
        sources: './src',
        tests: './test',
        cache: './cache_hardhat',
        artifacts: './artifacts',
    },
}

export default config
