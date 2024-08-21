#!/bin/bash

# Script for setting up the project
# This script assumes a unix environment
# Last modified: 20/08/2024

HARDHAT_DEFAULT_PORT=8545

cmd_exists() {
    command -v "$1" &> /dev/null
}

if ! cmd_exists yarn; then
    echo "Error: yarn is not installed or not in PATH"; exit 1
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
yarn local-node > /dev/null &
HH_NODE_PID=$!

echo "Waiting for hardhat local node..."
while ! nc -z localhost $HARDHAT_DEFAULT_PORT; do
    sleep 0.25
done
echo "Local node ready"

yarn cand
require_ok "generate candidates"
yarn types
require_ok "generate web types"
yarn deploy:local
require_ok "hardhat localhost deploy"

cd ../frontend
yarn --dev
echo "Setup complete. Run web locally with: 'cd frontend && yarn dev:test'"
kill  $HH_NODE_PID