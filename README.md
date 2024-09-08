# Graviola

# [GraviolaNFT](https://el-tumero.github.io/graviola/)

> [!NOTE]
> Graviola is growing rapidly; we're introducing big changes lately. If you encounter bugs or unexpected errors, please open an [Issue](https://github.com/el-tumero/graviola/issues).

## About

Graviola allows to create unique, dynamically generated NFTs using Stable Diffusion on-chain.
We're using [ORA](https://www.ora.io/) as our backend - we use their [OAO](https://www.ora.io/app/opml/models) to generate proofs of generation for all graviola NFTs. This means that you can check if someone made their NFT using our services or just ran Stable Diffusion locally.

## Website

Live on **Arbitrum One Sepolia** testnet!

https://el-tumero.github.io/graviola/

## Contracts

| **Contract**           | **Address**                                | **Block explorer**                                                             |
| ---------------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| GraviolaCollection     | 0x5DeA8a4062E82CB44EBCA7CeBaa37B510eB6a6A9 | https://sepolia.arbiscan.io/address/0x5DeA8a4062E82CB44EBCA7CeBaa37B510eB6a6A9 |
| GraviolaGenerator      | 0xAe48A15dE641fAC97AD5DC4faB28d31EF0c0B428 | https://sepolia.arbiscan.io/address/0xAe48A15dE641fAC97AD5DC4faB28d31EF0c0B428 |
| GraviolaSeasonsArchive | 0x6772D1461977f02D540108fFB8f33E8218DeCAc1 | https://sepolia.arbiscan.io/address/0x6772D1461977f02D540108fFB8f33E8218DeCAc1 |

## How it works?

You can read more about how Graviola works on our [website](https://el-tumero.github.io/graviola/)

## Community

Community discord: https://discord.com/invite/FsMWpsqsG7

## App Setup

1. `git clone https://github.com/el-tumero/graviola && cd graviola`
2. download Foundry https://book.getfoundry.sh/getting-started/installation#using-foundryup
3. generate types for the frontend
    1. `cd contracts && yarn`
    2. `yarn types`
4. run website
   1. `cd ../frontend && yarn`
   2. `yarn dev`

## Contributing

We welcome anyone who brings value to this project. If you'd like to contribute, please read (in order):
- [CONTRIBUTING.md](https://github.com/el-tumero/graviola/blob/6067fcb4aba5a7daddc483297612b235f7f335b2/CONTRIBUTING.md)
- [Our Wiki](https://github.com/el-tumero/graviola/wiki), where we store Development notes and important technical details

