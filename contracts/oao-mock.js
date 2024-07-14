require('dotenv').config()
// const addresses = require("./addresses.json")
const localAddresses = require("./addresses-local.json")

const ethers = require("ethers")

const URL = "http://localhost:8545"
const PRIV_KEY = process.env.PRIVATE_KEY
const provider = new ethers.JsonRpcProvider(URL);
const wallet = new ethers.Wallet(PRIV_KEY);
const signer = wallet.connect(provider)

const IMG_URL = "QmTjUY4rQLrgv8tjedXoXDmXRtahL1bcFVK64jnTkiVGEn"
const OAOContractAddress = localAddresses.OAO_ADDRESS

const abi = [
    "function invokeNextCallback(bytes calldata output) public",
    "function invokeCallback(uint256 requestId, bytes calldata output) public",
]

const AIOracleMock = new ethers.Contract(OAOContractAddress, abi, signer)

async function main() {
    const tx = await AIOracleMock.invokeNextCallback(ethers.toUtf8Bytes(IMG_URL))
    await tx.wait()
    console.log("Output added!")
}

main()

