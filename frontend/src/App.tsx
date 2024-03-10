import "./App.css"
import { useEffect, useState, ReactNode } from 'react'
import { createWeb3Modal, defaultConfig, useWeb3ModalProvider } from '@web3modal/ethers5/react'
import { ethers } from 'ethers'
import GraviolaAbi from "../../contracts/artifacts/contracts/Graviola.sol/Graviola.json"
import { Graviola } from '../../contracts/typechain-types/contracts/Graviola'
import { GraviolaContext } from "./contexts/GraviolaContext"
import { NFT } from "./types/NFT"
import { Keyword } from "./types/Keyword"
import Loading from "./pages/Loading"
import useTheme from "./hooks/useTheme"

export const GRAVIOLA_CONTRACT_ADDRESS = "0xf378b8be1b54CCaD85298e76E5ffDdA03ef1A89B"

// No wallet connected (read-only)
async function connectContract(): Promise<Graviola> {
    console.log("[readonly] connecting to contract...")
    const provider = new ethers.providers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com")
    const graviola = new ethers.Contract(GRAVIOLA_CONTRACT_ADDRESS, GraviolaAbi.abi, provider)
    console.log("[readonly] connected")
    return graviola as unknown as Graviola
}

// Conn to contract with wallet
async function connectContractWallet(walletProvider: ethers.providers.ExternalProvider): Promise<Graviola> {
    console.log("[wallet] connecting to contract...")
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider)
    const signer = ethersProvider.getSigner()
    const graviola = new ethers.Contract(GRAVIOLA_CONTRACT_ADDRESS, GraviolaAbi.abi, signer)
    console.log("[wallet] connected")
    return graviola as unknown as Graviola
}

const App = (props: { children: ReactNode }) => {

    const [,] = useTheme()
    const [graviola, setGraviola] = useState<Graviola | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    // Contract data    
    const [dataFetched, setDataFetched] = useState<boolean>(false)
    const [collection, setCollection] = useState<NFT[]>([])
    const [keywords, setKeywords] = useState<Keyword[]>([])

    // Web3 stuff
    // const { isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()
    
    const graviolaContextValue = {
        contract: graviola,
        collection: collection,
        keywords: keywords
    }

    // Fetch NFT data for read-only site mode
    useEffect(() => {
        if (!graviola || dataFetched) return
    
        const fetchCollection = async () => {

            const allKeywords = await graviola.getAllWords()
            const promises = Array.from({ length: allKeywords.length }, async (_, i) => {
                const uri = await graviola.tokenURI(BigInt(i))
                const response = await fetch(uri)
                return response.json()
            })
            
            // Nfts
            const collection = await Promise.all(promises)
            console.log("fetched collection ", collection)
            setCollection(prev => [...prev, ...collection])

            // Keywords
            allKeywords.map((keywordData) => {
                const keyword: Keyword = {
                    name: keywordData[0],
                }
                console.log(keyword) // valid keyword data
                setKeywords(prev => [...prev, keyword])
            })
    
            setLoading(false)
        }

        fetchCollection()
        setDataFetched(true)

    }, [graviola])

    useEffect(() => {
        if (walletProvider) connectContractWallet(walletProvider).then(contract => setGraviola(contract)) // override readonly contract conn
        else connectContract().then(noWalletContract => setGraviola(noWalletContract))
    }, [walletProvider])

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
            <Loading />
        :
            <>
                <GraviolaContext.Provider value={graviolaContextValue}>
                    {props.children}
                </GraviolaContext.Provider>
            </>
    )   
}

export default App