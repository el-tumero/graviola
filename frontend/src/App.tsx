import "./App.css"
import { useEffect, useState, ReactNode } from 'react'
import { createWeb3Modal, defaultConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react'
import { ethers } from 'ethers'
import GraviolaAbi from "../../contracts/artifacts/contracts/Graviola.sol/Graviola.json"
import { Graviola } from '../../contracts/typechain-types/contracts/Graviola'
import { GraviolaContext, NFT } from "./contexts/GraviolaContext"

export const GRAVIOLA_CONTRACT_ADDRESS = "0xf378b8be1b54CCaD85298e76E5ffDdA03ef1A89B"

async function connectContract(): Promise<Graviola> {
    // const ethersProvider = new ethers.providers.Web3Provider(walletProvider)
    const provider = new ethers.providers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com")
    // const signer = await ethersProvider.getSigner()
    const graviola = new ethers.Contract(GRAVIOLA_CONTRACT_ADDRESS, GraviolaAbi.abi, provider)
    return graviola as unknown as Graviola
}

async function connectContractWallet(walletProvider: ethers.providers.ExternalProvider): Promise<Graviola> {
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider)
    const signer = ethersProvider.getSigner()
    const graviola = new ethers.Contract(GRAVIOLA_CONTRACT_ADDRESS, GraviolaAbi.abi, signer)
    return graviola as unknown as Graviola
}

const App = (props: { children: ReactNode }) => {

    const [graviola, setGraviola] = useState<Graviola | null>(null)
    const [collection, setCollection] = useState<NFT[]>([])
    const { isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()
    const [loading, setLoading] = useState<boolean>(true)
    
    const graviolaContextValue = {
        contract: graviola,
        collection: collection
    }

    useEffect(() => {
        if (!graviola) return
        (async() => {
            for (let i = 0; i < 4; i++) {
                const uri = await graviola?.tokenURI(BigInt(i))
                const obj = await (await fetch(uri)).json() as NFT
                setCollection((prev) => [...prev, obj])
            }
        })()
    }, [graviola])

    // SO UGLY CHANGE THIS LATER (UGLY AF) (UGLY)
    useEffect(() => {
        if (collection.length < 3) return
        setLoading(false)
    }, [collection])

    useEffect(() => {
        if(isConnected && walletProvider) connectContractWallet(walletProvider).then(contract => setGraviola(contract))
    }, [isConnected, walletProvider])


    const projectId = 'a09890b34dc1551c2534337dbc22de8c'
    // 1. Get projectId

    // 2. Set chains
    const sepolia = {
        chainId: 11155111,
        name: 'Sepolia testnet',
        currency: 'ETH',
        explorerUrl: 'https://sepolia.etherscan.io/',
        rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com'
    }

    // 3. Create modal
    const metadata = {
        name: 'Graviola NFT',
        description: 'NFT generator powered by opML',
        url: 'https://mywebsite.com', // origin must match your domain & subdomain
        icons: ['https://avatars.mywebsite.com/']
    }

    createWeb3Modal({
        ethersConfig: defaultConfig({ metadata }),
        chains: [sepolia],
        projectId,
        enableAnalytics: true // Optional - defaults to your Cloud configuration
    })



    return (
        (loading) ? 
            <>loading...</>
        :
            <>
                <GraviolaContext.Provider value={graviolaContextValue}>
                    {props.children}
                </GraviolaContext.Provider>
            </>
    )   
}

export default App