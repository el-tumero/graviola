#!/bin/bash

# Script for setting up the project
# This script assumes a unix environment
# Last modified: 07/08/2024

cmd_exists() {
    command -v "$1" &> /dev/null
}

if ! cmd_exists yarn; then
    echo "Error: yarn is not installed or not in PATH"; exit 1
fi

if ! cmd_exists forge; then
    echo "Error: forge (Foundry) is not installed or not in PATH"; exit 1
fi

require_ok() {
    if [ $? -ne 0 ]; then
        echo "Error: $1 failed"
        exit 1
    fi
}

cd contracts
yarn --dev
require_ok "yarn install in contracts"
npx hardhat compile
require_ok "hardhat compile"
yarn cand
require_ok "generate candidates"
yarn types
require_ok "generate web types"
yarn local-node &
HH_NODE_PID=$!
yarn deploy:local
require_ok "hardhat localhost deploy"

cd ../frontend
yarn --dev
echo "Setup complete. Run web locally with: 'cd frontend && yarn dev:test'"
kill  $HH_NODE_PID