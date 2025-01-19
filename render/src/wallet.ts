import {
    GraviolaGenerator__factory,
    type GraviolaGenerator,
} from "@graviola/contracts/typechain"
import { addresses as target } from "@graviola/contracts/addresses"
import {
    BrowserProvider,
    JsonRpcProvider,
    Wallet,
    type Eip1193Provider,
    type Signer,
} from "ethers"

let provider: BrowserProvider | JsonRpcProvider | undefined
let signer: Signer | undefined
let address: string | undefined
let addresses = target.testnet

export const setupProvider = async (walletProvider: Eip1193Provider) => {
    provider = new BrowserProvider(walletProvider)
    signer = await provider.getSigner()
    address = await signer.getAddress()
}

export const setupDevWallet = async () => {
    provider = new JsonRpcProvider("http://localhost:8545")
    const wallet = new Wallet(
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        provider,
    )
    address = await wallet.getAddress()
    signer = wallet
    addresses = target.local
}

export const removeProvider = () => {
    provider = undefined
}

export const getGeneratorContract = (): GraviolaGenerator =>
    GraviolaGenerator__factory.connect(addresses.GENERATOR_ADDRESS, signer)

export const getProvider = () => provider

export const getSigner = () => signer

export const getUserAddress = () => address
