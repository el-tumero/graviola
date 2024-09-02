#!/bin/bash

# Script for setting up the project
# This script assumes a unix environment
# Last modified: 02/09/2024

HARDHAT_DEFAULT_PORT=8545

cmd_exists() {
    command -v "$1" &> /dev/null
}

if ! cmd_exists yarn; then
    echo "Error: yarn is not installed or not in PATH"; exit 1
fi

if ! cmd_exists nc; then
    echo "Error: nc (netcat) is not installed or not in PATH"; exit 1
fi

require_ok() {
    if [ $? -ne 0 ]; then
        echo "Error: $1 failed"
        exit 1
    fi
}

clear

cd contracts
yarn --dev
require_ok "yarn install in contracts"

bash ./utils/clear-cache.sh

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
echo "Setup complete. To run the project locally:"
echo "'cd frontend && yarn dev'"
echo "Make sure to kill the Hardhat Node that's running in the background when you're done"
echo "Hardhat Node PID: $HH_NODE_PID"