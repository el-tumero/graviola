pnpm --filter @graviola/contracts run local-node > /dev/null &
node=$!
echo "[DEV] Started local node: ${node}"

while ! curl -s http://localhost:8545 > /dev/null; do
  sleep 1
done

echo "[DEV] Local node is up"

pnpm --filter @graviola/contracts run deploy-contracts:local

pnpm --filter @graviola/contracts run mock-bot &
mock_bot=$!
echo "[DEV] Started mock bot: ${mock_bot}"

bun event/server.ts &
event_server=$!
echo "[DEV] Started event server: ${event_server}"

pnpm --filter @graviola/render run dev:local

trap "pkill -P $$" SIGINT
wait $node $mock_bot $event_server
echo "[DEV] Done"

