import "./App.css"
import { useEffect, useState, ReactNode } from 'react'
import { createWeb3Modal, defaultConfig, useWeb3ModalProvider, useWeb3ModalTheme } from '@web3modal/ethers/react'
import { BrowserProvider, Eip1193Provider, JsonRpcProvider } from 'ethers'
import { Graviola } from "../../contracts/typechain-types/contracts/Graviola"
import { Graviola__factory as GraviolaFactory } from "../../contracts/typechain-types/factories/contracts/Graviola__factory"
import { GraviolaContext } from "./contexts/GraviolaContext"
import { NFT } from "./types/NFT"
import { Keyword } from "./types/Keyword"
import Loading from "./pages/Loading"
import useTheme from "./hooks/useTheme"
import { GRAVIOLA_ADDRESS } from "../../contracts/scripts/constants"

// No wallet connected (read-only)
async function connectContract(): Promise<Graviola> {
    console.log("[readonly] connecting to contract...")
    const provider = new JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com")
    const graviola = GraviolaFactory.connect(GRAVIOLA_ADDRESS, provider)
    console.log("[readonly] connected")
    return graviola as unknown as Graviola
}

// Conn to contract with wallet
async function connectContractWallet(walletProvider: Eip1193Provider): Promise<Graviola> {
    console.log("[wallet] connecting to contract...")
    const provider = new BrowserProvider(walletProvider)
    const signer = await provider.getSigner()
    const graviola = GraviolaFactory.connect(GRAVIOLA_ADDRESS, signer)
    console.log("[wallet] connected")
    return graviola as unknown as Graviola
}

const App = (props: { children: ReactNode }) => {

    const projectId = 'a09890b34dc1551c2534337dbc22de8c'
    const sepolia = {
        chainId: 11155111,
        name: 'Sepolia testnet',
        currency: 'ETH',
        explorerUrl: 'https://sepolia.etherscan.io/',
        rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com'
    }
    const metadata = {
        name: 'Graviola NFT',
        description: 'NFT generator powered by opML',
        url: 'https://mywebsite.com', // origin must match your domain & subdomain
        icons: ['https://avatars.mywebsite.com/']
    }

    const modal = createWeb3Modal({
        ethersConfig: defaultConfig({ metadata }),
        chains: [sepolia],
        projectId
    })


    const { walletProvider } = useWeb3ModalProvider()
    const [,] = useTheme((modal === undefined))

    const [graviola, setGraviola] = useState<Graviola | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    // Contract data    
    const [dataFetched, setDataFetched] = useState<boolean>(false)
    const [collection, setCollection] = useState<NFT[]>([])
    const [keywords, setKeywords] = useState<Keyword[]>([])

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
            const nftTotalSupply = await graviola.totalSupply()
            console.log("[info] getAllWords: ", allKeywords)
            console.log("[info] totalSupply: ", Number(nftTotalSupply))
            const promises = Array.from({ length: Number(nftTotalSupply) }, async (_, i) => {
                const uri = await graviola.tokenURI(BigInt(i))
                const response = await fetch(uri)
                return response.json()
            })
            
            // Nfts
            const collection = await Promise.all(promises)
            console.log("[info] fetched collection ", collection)
            setCollection(prev => [...prev, ...collection])

            // Keywords
            allKeywords.map((keywordData) => {
                const keyword: Keyword = {
                    name: keywordData[0],
                    rarityPerc: Number(keywordData[1]),
                }
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