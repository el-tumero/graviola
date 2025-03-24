# Dev notice

All Solidity code is automatically linted and verified.
Contrary to ESLint, this configuration allows to push code with errors.
Solhint is configured to dump a report.txt file - please review it before committing.

## Start

## Deploy scripts

`pnpm deploy-contracts:local`

Runs script which deploys mock contracts (to hardhat network), generates typechain types and adds contract addresses to addresses-local.json file.

### For Testnet

`pnpm deploy-contracts:testnet`

#### Required .env keys

-   PRIVATE_KEY : string
-   API_KEY_INFURA : string
-   ARBISCAN_API_KEY: string
