import { Eip1193Provider, Wallet } from "ethers"
import { JsonRpcProvider } from "ethers"
import {
    setSigner,
    connectContractsToSigner,
    generator,
    collection,
    token,
    seasonsGovernor,
} from "../web3"

import localhostConfig from "../../../contracts/localhost-config.json"
import { useAppSelector, useAppDispatch } from "../redux/hooks"
import { setConnected, setAddress } from "../redux/reducers/wallet"
import { Web3Address } from "../redux/reducers/wallet"
import { BrowserProvider } from "ethers"

export default function useWallet() {
    const isConnected = useAppSelector((state) => state.wallet.isConnected)
    const address = useAppSelector((state) => state.wallet.address)

    const dispatch = useAppDispatch()

    const generatorContract = generator
    const collectionContract = collection
    const tokenContract = token
    const seasonsGovernorContract = seasonsGovernor

    function connectDevWallet() {
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
        generatorContract,
        collectionContract,
        tokenContract,
        seasonsGovernorContract,
    }
}
