require('dotenv').config()
const addresses = require("./addresses.json")
const ethers = require("ethers")

const URL = "https://sepolia-rollup.arbitrum.io/rpc"
const PRIV_KEY = process.env.PRIVATE_KEY
const provider = new ethers.JsonRpcProvider(URL);
const wallet = new ethers.Wallet(PRIV_KEY);
const signer = wallet.connect(provider)

const IMG_URL = "QmTjUY4rQLrgv8tjedXoXDmXRtahL1bcFVK64jnTkiVGEn"
const OAOContractAddress = addresses.OAO_ADDRESS

const abi = [
    "function invokeNextCallback(bytes calldata output) public",
]

const AIOracleMock = new ethers.Contract(OAOContractAddress, abi, signer)

async function main() {
    const tx = await AIOracleMock.invokeNextCallback(ethers.toUtf8Bytes(IMG_URL))
    const recp = await tx.wait()
    console.log(recp)
    console.log("Output added!")
}

main()

