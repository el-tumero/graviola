import "./App.css"
import { useEffect, useState, ReactNode } from "react"
import { createWeb3Modal, defaultConfig, useWeb3ModalProvider } from "@web3modal/ethers/react"
import { BrowserProvider, Eip1193Provider, JsonRpcProvider } from "ethers"
import { Graviola } from "../../contracts/typechain-types/Graviola"
import { Graviola__factory as GraviolaFactory } from "../../contracts/typechain-types/factories/Graviola__factory"
import { GraviolaContext } from "./contexts/GraviolaContext"
import { AppContext } from "./contexts/AppContext"
import { NFT } from "./types/NFT"
import Loading from "./pages/Loading"
import useTheme from "./hooks/useTheme"
import { GRAVIOLA_ADDRESS } from "../../contracts/addresses.json"
import { rarityScale, rarityGroupColors } from "./rarityData"
import { RarityLevel, RarityGroupData } from "./types/Rarity"
import { Keyword } from "./types/Keyword"
import { RaritiesData } from "./types/RarityGroup"
import { fallbackNFT } from "./utils/fallbackNFT"

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
    const projectId = "a09890b34dc1551c2534337dbc22de8c"
    const sepolia = {
        chainId: 11155111,
        name: "Sepolia testnet",
        currency: "ETH",
        explorerUrl: "https://sepolia.etherscan.io/",
        rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
    }
    const metadata = {
        name: "Graviola NFT",
        description: "NFT generator powered by opML",
        url: "https://mywebsite.com", // origin must match your domain & subdomain
        icons: ["https://avatars.mywebsite.com/"],
    }

    const modal = createWeb3Modal({
        ethersConfig: defaultConfig({
            metadata,
        }),
        chains: [sepolia],
        projectId,
    })

    const { walletProvider } = useWeb3ModalProvider()
    const [theme, toggleTheme] = useTheme(modal === undefined)

    const [graviola, setGraviola] = useState<Graviola | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    // Contract data
    const [dataFetched, setDataFetched] = useState<boolean>(false)
    const [collection, setCollection] = useState<NFT[]>([])
    const [rarities, setRarities] = useState<RaritiesData | null>(null)

    const graviolaContextValue = {
        contract: graviola,
        collection: collection,
        rarities: rarities,
    }

    const appContextValue = {
        theme,
        toggleTheme,
    }

    // Fetch contract data
    useEffect(() => {
        if (!graviola || dataFetched) return

        const fetchCollection = async () => {
            const rarityGroupsData = await graviola.getRarityGroups()
            const nftTotalSupply = await graviola.totalSupply()
            console.log("[info] totalSupply: ", Number(nftTotalSupply))
            const promises = Array.from(
                {
                    length: Number(nftTotalSupply),
                },
                async (_, i) => {
                    try {
                        const uri = await graviola.tokenURI(BigInt(i))
                        const response = await fetch(uri)
                        return response.json()
                    } catch (error) {
                        // console.warn(`[warn] err while fetching collection: ${error}`)
                        return fallbackNFT
                    }
                },
            )

            // Nfts
            const collection: NFT[] = await Promise.all(promises)
            console.log("[info] fetched collection ", collection)
            setCollection((prev) => [...prev, ...collection])

            const raritiesData = rarityGroupsData.reduce<Record<RarityLevel, RarityGroupData>>(
                (acc, groupData, index) => {
                    // Cast keywords
                    const keywords: Keyword[] = groupData.keywords.map((keyword) => ({
                        name: keyword[0],
                        lowerRange: Number(keyword[1]),
                        upperRange: Number(keyword[2]),
                    }))

                    const rarityGroupData: RarityGroupData = {
                        name: groupData.name,
                        rarityPerc: Number(groupData.rarityPerc),
                        color: rarityGroupColors[rarityScale[index]],
                        keywords,
                    }

                    acc[rarityScale[index] as RarityLevel] = rarityGroupData
                    return acc
                },
                {} as Record<RarityLevel, RarityGroupData>,
            )

            console.log("[info] raritiesData: ", raritiesData)
            setRarities(raritiesData)

            setLoading(false)
        }

        fetchCollection()
        setDataFetched(true)
    }, [graviola])

    useEffect(() => {
        if (walletProvider) connectContractWallet(walletProvider).then((contract) => setGraviola(contract))
        // override readonly contract conn
        else connectContract().then((noWalletContract) => setGraviola(noWalletContract))
    }, [walletProvider])

    return loading ? (
        <Loading />
    ) : (
        <GraviolaContext.Provider value={graviolaContextValue}>
            <AppContext.Provider value={appContextValue}>{props.children}</AppContext.Provider>
        </GraviolaContext.Provider>
    )
}

export default App
