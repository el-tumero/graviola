# [GraviolaNFT](https://el-tumero.github.io/graviola/)

> [!NOTE]
> Graviola is growing rapidly; we're introducing big changes lately. If you encounter bugs or unexpected errors, please open an [Issue](https://github.com/el-tumero/graviola/issues).

## About

Graviola allows to create unique, dynamically generated NFTs using Stable Diffusion on-chain.
We're using [ORA](https://www.ora.io/) as our backend - we use their [OAO](https://www.ora.io/app/opml/models) to generate proofs of generation for all graviola NFTs. This means that you can check if someone made their NFT using our services or just ran Stable Diffusion locally.

## Website

You can read more about how Graviola works on our [website](https://el-tumero.github.io/graviola/)

## Community

Community discord: https://discord.com/invite/FsMWpsqsG7

## Contributing

We welcome anyone who brings value to this project. If you'd like to contribute, please read (in order):
- [CONTRIBUTING.md](https://github.com)
- [Our Wiki](https://github.com/el-tumero/graviola/wiki), where we store Development notes and important technical details









<!-- OLD Hackathon README -->

<!-- # Graviola

Project for [Autonomous Agent: AI x Web3 Hackathon 2024](https://autonomous-agent.devpost.com/) (ORA Bounty 2 Winner)

## About

Graviola's initiative employs blockchain, AI, and randomness to autonomously produce NFTs using user-supplied and on-chain stored keywords. It processes these keywords into AI-generated portraits through Stable Diffusion, then catalogs these unique NFTs with associated rarity and other metadata attributes on the blockchain.

## App Setup

1. `git clone https://github.com/el-tumero/graviola && cd graviola`
2. download Foundry https://book.getfoundry.sh/getting-started/installation#using-foundryup
3. generate types for the frontend
   1. `cd contracts && yarn`
   2. `yarn build && yarn types`
4. run website
   1. `cd ../frontend && yarn`
   2. `yarn dev`

## Live demo

https://el-tumero.github.io/graviola/ -->