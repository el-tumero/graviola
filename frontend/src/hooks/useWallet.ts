import { Eip1193Provider, Wallet } from "ethers"
import { JsonRpcProvider } from "ethers"
import {
    setSigner,
    connectContractsToSigner,
    generatorContract,
    collectionContract,
    tokenContract,
    seasonsGovernorContract,
    seasonsArchiveContract,
} from "../web3"

import localhostConfig from "../../../contracts/localhost-config.json"
import { useAppSelector, useAppDispatch } from "../redux/hooks"
import { setConnected, setAddress } from "../redux/reducers/wallet"

import { Web3Address } from "../redux/reducers/wallet"
import { BrowserProvider } from "ethers"

export default function useWallet() {
    const isConnected = useAppSelector((state) => state.wallet.isConnected)
    const address = useAppSelector((state) => state.wallet.address)
    const collection = useAppSelector((state) => state.graviolaData.collection)

    const dispatch = useAppDispatch()

    async function connectDevWallet() {
        const provider = new JsonRpcProvider(localhostConfig.rpcUrl)
        const wallet = new Wallet(localhostConfig.privKey, provider)
        dispatch(setAddress(wallet.address as Web3Address))
        setSigner(wallet)
        connectContractsToSigner()
        dispatch(setConnected(true))
    }

    async function connectWallet(walletProvider: Eip1193Provider) {
        const provider = new BrowserProvider(walletProvider)
        const signer = await provider.getSigner()
        dispatch(setAddress(signer.address as Web3Address))
        setSigner(signer)
        connectContractsToSigner()
        dispatch(setConnected(true))
    }

    return {
        connectWallet,
        connectDevWallet,
        isConnected,
        address,
        collection,
        generatorContract,
        collectionContract,
        tokenContract,
        seasonsGovernorContract,
        seasonsArchiveContract,
    }
}
