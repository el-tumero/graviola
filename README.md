# Graviola

Project for [Autonomous Agent: AI x Web3 Hackathon 2024](https://autonomous-agent.devpost.com/) (ORA Bounty 2 Winner)

## About

Graviola's initiative employs blockchain, AI, and randomness to autonomously produce NFTs using user-supplied and on-chain stored keywords. It processes these keywords into AI-generated portraits through Stable Diffusion, then catalogs these unique NFTs with associated rarity and other metadata attributes on the blockchain.

## Live demo

Live on **Arbitrum One Sepolia** testnet!

https://el-tumero.github.io/graviola/

## Contracts

| **Contract**           | **Address**                                | **Block explorer**                                                             |
| ---------------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| GraviolaCollection     | 0x5DeA8a4062E82CB44EBCA7CeBaa37B510eB6a6A9 | https://sepolia.arbiscan.io/address/0x5DeA8a4062E82CB44EBCA7CeBaa37B510eB6a6A9 |
| GraviolaGenerator      | 0xAe48A15dE641fAC97AD5DC4faB28d31EF0c0B428 | https://sepolia.arbiscan.io/address/0xAe48A15dE641fAC97AD5DC4faB28d31EF0c0B428 |
| GraviolaSeasonsArchive | 0x6772D1461977f02D540108fFB8f33E8218DeCAc1 | https://sepolia.arbiscan.io/address/0x6772D1461977f02D540108fFB8f33E8218DeCAc1 |

## App Setup

1. `git clone https://github.com/el-tumero/graviola && cd graviola`
2. download Foundry https://book.getfoundry.sh/getting-started/installation#using-foundryup
3. generate types for the frontend
    1. `cd contracts && yarn`
    2. `yarn build && yarn types`
4. run website
    1. `cd ../frontend && yarn`
    2. `yarn dev`
