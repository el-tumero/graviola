# .env keys

### Local blockchain

-   VITE_DEV_PROVIDER : bool `set to true for local dev`
-   VITE_DEV_RPC : string `http://localhost:8545 for local dev`
-   VITE_TESTNET_RPC: string `needs to be WSS`

### Running local blockchain

1. (frontend) - `yarn dev` - This runs hardhat network in background and starts the website on port `5173`
2. (contracts) - `yarn deploy:local` - Deploy the localhost contract and types
3. (frontend) - Refresh website (addresses-local.json should be available by now)

### Running e2e tests

1. `yarn test` - This runs every available test
2. `yarn test <path>` - This runs the test on the specified path

### Running web on localhost

1. (contracts) - `yarn local-node`
2. (contracts) - `yarn deploy:local`
3. (frontend) - `yarn dev`
