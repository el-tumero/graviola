# Graviola

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

https://el-tumero.github.io/graviola/
