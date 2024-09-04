#!/bin/bash

# Clears all cached directories in /contracts
# This script assumes a unix environment
# Last modified: 21/08/2024

declare -a DIRS=("artifacts" "cache_hardhat" "typechain-types")
declare -a FILES=("candidates.json")

script_dir="$(dirname "$0")"
parent_dir="$(dirname "$script_dir")"

for i in "${DIRS[@]}"
do
   rm -rf "$parent_dir/$i"
   echo "Dir '$i' removed"
done

for i in "${FILES[@]}"
do
   rm "$parent_dir/$i"
   echo "File '$i' removed"
done

echo "Done"