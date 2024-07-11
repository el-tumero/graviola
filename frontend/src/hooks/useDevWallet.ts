import { JsonRpcProvider, Wallet } from "ethers";
import { useEffect, useState } from "react";

export default function useDevWallet():(Wallet | undefined) {

    const [wallet, setWallet] = useState<Wallet>()

    useEffect(() => {
        if(import.meta.env.VITE_DEV_PROVIDER === "true" && !wallet) {
            const provider = new JsonRpcProvider("http://localhost:8545", {chainId: 1337, name: "localhost"})
            const wallet = new Wallet("0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d", provider)
            setWallet(wallet)
        }
    }, [[wallet]])

    return wallet
}