# Dev notice

All Solidity code is automatically linted and verified.
Contrary to ESLint, this configuration allows to push code with errors.
Solhint is configured to dump a report.txt file - please review it before committing.

## Deploy scripts
`yarn deploy:testnet`

Runs script which deploys main contract (to testnet), generates typechain types and adds contract addresses to addresses.json file

## Local version
`yarn deploy:local`

Deploy localhost contract for ganache frontend testing

# .env keys

### Local blockchain

- PRIVATE_KEY : string
- API_KEY_INFURA : string

### e2e tests

- NETWORK_NAME : string