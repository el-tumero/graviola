import "./App.css"
import { useEffect, useState, ReactNode } from 'react'
import { createWeb3Modal, defaultConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react'
import { ethers } from 'ethers'
import GraviolaAbi from "../../contracts/artifacts/contracts/Graviola.sol/Graviola.json"
import { Graviola } from '../../contracts/typechain-types/contracts/Graviola'
import { GraviolaContext } from "./contexts/GraviolaContext"

const GRAVIOLA_CONTRACT_ADDRESS = "0xcf4CC45760234b1b9180bDA0E6FBBb4d2f7392Af"

async function connectContract(walletProvider: ethers.providers.ExternalProvider): Promise<Graviola> {
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const graviola = new ethers.Contract(GRAVIOLA_CONTRACT_ADDRESS, GraviolaAbi.abi, signer)
    return graviola as unknown as Graviola
}

const App = (props: { children: ReactNode }) => {

    const [graviola, setGraviola] = useState<Graviola | null>(null)
    const { isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()
    const [loading, setLoading] = useState<boolean>(false)
    
    const graviolaContextValue = {
        contract: graviola
    }

    useEffect(() => {
        if (!graviola) return
        setLoading(false)
    }, [graviola, setGraviola])

    useEffect(() => {
        if (isConnected && walletProvider) {
            connectContract(walletProvider).then(contract => setGraviola(contract))
        }
    }, [isConnected, walletProvider])

    // useEffect(() => {
    //     if (graviola) graviola.tokenURI(0n).then(uri => console.log(uri))
    // }, [graviola])

    // 1. Get projectId
    const projectId = 'a09890b34dc1551c2534337dbc22de8c'

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