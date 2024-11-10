import {
    BrowserProvider,
    WebSocketProvider,
    type Eip1193Provider,
} from "ethers"

let provider: BrowserProvider | WebSocketProvider | undefined

export const setupProvider = (walletProvider: Eip1193Provider) => {
    provider = new BrowserProvider(walletProvider)
}

export const removeProvider = () => {
    provider = undefined
}

export const getProvider = () => provider

export const getSigner = async () => provider?.getSigner()
