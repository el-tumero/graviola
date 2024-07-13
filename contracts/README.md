# Contract repo

## Dev notice

All Solidity code is automatically linted and verified.
Contrary to ESLint, this configuration allows to push code with errors.
Solhint is configured to dump a report.txt file - please review it before committing.

## Deployment

- Create .env file and add following keys:
  - API_KEY_INFURA - infura API key
  - PRIVATE_KEY - private key (EOA), prefixed with `0x`

### Deployment script
```bash
yarn deploy
```
runs script which deploys main contract, generate typechain types and add contract addresses to addresses.json file


