# .env keys

### Local blockchain

-   VITE_DEV_PROVIDER : bool
-   VITE_DEV_RPC : string

### Running local blockchain

1. (frontend) - `yarn dev:test` - This runs ganache in background and starts the website on port `3000`
2. (contracts) - `yarn deploy:local` - Deploy the localhost contract and types
3. (frontend) - Refresh website (addresses-local.json should be available by now)

### Running e2e tests

1. `yarn test` - This runs every available test
2. `yarn test <path>` - This runs the test on the specified path
