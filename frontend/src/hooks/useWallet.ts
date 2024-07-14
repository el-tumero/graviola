import { Eip1193Provider, Wallet } from "ethers";
import { JsonRpcProvider } from "ethers";
import { setSigner, connectContractsToSigner, graviolaContract } from "../web3";


import { useAppSelector, useAppDispatch } from '../app/hooks'
import { setConnected, setAddress } from "../features/wallet/walletSlice";
import { Web3Address } from "../features/wallet/walletSlice";
import { BrowserProvider } from "ethers";


export default function useWallet(){
    const isConnected = useAppSelector((state) => state.wallet.isConnected)
    const address = useAppSelector((state) => state.wallet.address)
    const graviola = graviolaContract
    
    const dispatch = useAppDispatch()
    
    function connectDevWallet(){
        const provider = new JsonRpcProvider(import.meta.env.VITE_DEV_RPC)
        const wallet = new Wallet("0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d", provider)
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

    
    return {connectWallet, connectDevWallet, isConnected, address, graviola}
}