# Contract repo

## Deployment

- Create .env file and add following keys:
  - API_KEY_INFURA - infura API key
  - PRIVATE_KEY - private key (EOA), prefixed with `0x`

### Deployment script
```bash
yarn deploy:testnet
```
runs script which deploys main contract (to testnet), generate typechain types and add contract addresses to addresses.json file

#### Local version
```bash
yarn deploy:local
```


