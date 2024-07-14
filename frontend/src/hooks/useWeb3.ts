import { Eip1193Provider, Wallet } from "ethers";
import { JsonRpcProvider } from "ethers";

import { useAppSelector, useAppDispatch } from '../app/hooks'
import { setWalletConnected, setWalletAddress, setSigner, connectSignerToContracts } from "../features/wallet/web3Slice";
import { Web3Address } from "../features/wallet/web3Slice";
import { BrowserProvider } from "ethers";


export default function useWallet(){
    const isWalletConnected = useAppSelector((state) => state.web3.isWalletConnected)
    const walletAddress = useAppSelector((state) => state.web3.walletAddress)
    const graviola = useAppSelector((state) => state.web3.contracts).graviola


    const dispatch = useAppDispatch()

    function connectDevWallet(){
        const provider = new JsonRpcProvider(import.meta.env.VITE_DEV_RPC)
        const wallet = new Wallet("0x1", provider)
        dispatch(setWalletAddress(wallet.address as Web3Address))
        dispatch(setSigner(wallet))
        dispatch(connectSignerToContracts())
        dispatch(setWalletConnected(true))
    }

    async function connectWallet(walletProvider: Eip1193Provider) {
        const provider = new BrowserProvider(walletProvider)
        const signer = await provider.getSigner()
        dispatch(setWalletAddress(signer.address as Web3Address))
        dispatch(setSigner(signer))
        dispatch(connectSignerToContracts())
        dispatch(setWalletConnected(true))
    }

    
    return {connectWallet, connectDevWallet, isWalletConnected, walletAddress, graviola}
}