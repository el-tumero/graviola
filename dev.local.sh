#!/bin/bash

pnpm --filter @graviola/contracts run local-node > /dev/null & # run local node in background
node=$!
echo "[DEV] Started local node: ${node}"

while ! curl -s http://localhost:8545 > /dev/null; do
  sleep 1
done

echo "[DEV] Local node is up"

pnpm --filter @graviola/contracts run deploy-contracts:local # deploy contracts to local node

pnpm --filter @graviola/contracts run mock-bot & # run mock bot in background
mock_bot=$!
echo "[DEV] Started mock bot: ${mock_bot}"

#bun event/server.ts & # run event server in background
#event_server=$!
#echo "[DEV] Started event server: ${event_server}"

pnpm --filter @graviola/render run dev:local # run render in dev mode

trap "pkill -P $$" SIGINT
wait $node $mock_bot $event_server
echo "[DEV] Done"

