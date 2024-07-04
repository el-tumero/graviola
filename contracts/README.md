# Contract repo

## Deployment

- Create .env file and add following keys:
  - API_KEY_INFURA - infura API key
  - PRIVATE_KEY - private key (EOA), prefixed with `0x`

```bash
forge script script/GraviolaDeploy.s.sol --rpc-url arb_sepolia --broadcast >> deploy.log
```
