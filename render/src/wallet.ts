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
}

export const removeProvider = () => {
    provider = undefined
}

export const getProvider = () => provider

export const getSigner = () => signer

export const getUserAddress = () => address
