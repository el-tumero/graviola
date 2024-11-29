pnpm --filter @graviola/contracts run local-node &
node=$!
echo "Started local node: ${node}"

while ! curl -s http://localhost:8545 > /dev/null; do
  sleep 1
done

echo "[DEV] Local node is up"

pnpm --filter @graviola/contracts run deploy-contracts:local

pnpm --filter @graviola/contracts run mock-bot &
mock_bot=$!
echo "Started mock bot: ${mock_bot}"

trap "pkill -P $$" SIGINT
wait $node $mock_bot
echo "Done"

