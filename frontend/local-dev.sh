#!/bin/bash

# clean old stuff if needed
rm -rf ../contracts/cache_hardhat
rm -rf ../contracts/out
rm -rf ../contracts/typechain-types
rm ../contracts/addresses-local.json

# build
cd ../contracts
yarn types
yarn local-node &
yarn deploy:local

# run web
cd ../frontend
yarn dev