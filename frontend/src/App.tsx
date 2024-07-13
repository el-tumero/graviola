import { useEffect, useState, ReactNode } from "react"
import tailwindConfig from "../tailwind.config"
import { createWeb3Modal, defaultConfig, useWeb3ModalProvider } from "@web3modal/ethers/react"
import { BrowserProvider, Eip1193Provider, JsonRpcProvider } from "ethers"
import { Graviola__factory as GraviolaFactory } from "../../contracts/typechain-types/factories/GraviolaMain.sol"
import { Graviola } from "../../contracts/typechain-types/GraviolaMain.sol"
import { GraviolaContext } from "./contexts/GraviolaContext"
import { NFT } from "./types/NFT"
import Loading from "./pages/Loading"
import useTheme from "./hooks/useTheme"
import { GRAVIOLA_ADDRESS } from "../../contracts/addresses.json"
import { GRAVIOLA_ADDRESS as GRAVIOLA_LOCAL_ADDRESS } from "../../contracts/addresses-local.json"

import { rarityScale, rarityGroupColors } from "./data/rarityData"
import { RarityLevel, RarityGroupData } from "./types/Rarity"
import { RaritiesData } from "./types/RarityGroup"
import { fallbackNFT } from "./data/fallbacks"
import { AppContext } from "./contexts/AppContext"
import { Signer } from "ethers"
import useDevWallet from "./hooks/useDevWallet"


import { useAppDispatch } from './app/hooks'
import { setConnectedTrue } from "./features/wallet/walletSlice"

// No wallet connected (read-only)
async function connectContract(): Promise<Graviola> {
    console.log("[App] connecting to contract... (read-only)")
    const localMode = import.meta.env.VITE_DEV_PROVIDER === "true"

    const provider = new JsonRpcProvider(
        localMode ? import.meta.env.VITE_DEV_RPC : "https://sepolia-rollup.arbitrum.io/rpc"
    )
    const graviola = GraviolaFactory.connect(
        localMode ? GRAVIOLA_LOCAL_ADDRESS : GRAVIOLA_ADDRESS, provider
    )
    console.log("[App] connected (read-only)")
    return graviola
}

// Conn to contract with wallet
async function connectContractWallet(walletProvider: Eip1193Provider): Promise<Graviola> {
    console.log("[App] connecting to contract... (wallet)")
    const provider = new BrowserProvider(walletProvider)
    const signer = await provider.getSigner()
    const graviola = GraviolaFactory.connect(GRAVIOLA_ADDRESS, signer)
    console.log("[App] connected (wallet)")
    return graviola
}

function connectContractDevWallet(signer:Signer): Graviola {
    if(!import.meta.env.VITE_DEV_GRAVIOLA_ADDRESS) console.error("No VITE_DEV_GRAVIOLA_ADDRESS env variable provided!")
    console.log(GRAVIOLA_LOCAL_ADDRESS)
        const graviola = GraviolaFactory.connect(GRAVIOLA_LOCAL_ADDRESS, signer)
    console.log("[App] connected (devWallet)")
    return graviola
}

const App = (props: { children: ReactNode }) => {
    const projectId = "a09890b34dc1551c2534337dbc22de8c"
    const sepolia = {
        chainId: 421614,
        name: "Arbitrum Sepolia",
        currency: "ETH",
        explorerUrl: "https://sepolia.etherscan.io/",
        rpcUrl: "https://endpoints.omniatech.io/v1/arbitrum/sepolia/public",
    }
    const mock = {
        chainId: 3151908,
        name: "Graviola Devnet",
        currency: "ETH",
        explorerUrl: "",
        rpcUrl: import.meta.env.VITE_DEV_RPC,
    }
    const metadata = {
        name: "Graviola NFT",
        description: "NFT generator powered by opML",
        url: "https://el-tumero.github.io/graviola/",
        icons: [],
    }

    const modal = createWeb3Modal({
        themeVariables: {
            "--w3m-accent": tailwindConfig.theme.extend.colors.accentDark,
        },
        ethersConfig: defaultConfig({
            metadata,
        }),
        chains: [import.meta.env.VITE_DEV_RPC ? mock : sepolia],
        projectId,
    })


    const { walletProvider } = useWeb3ModalProvider()

    const devWallet = useDevWallet()

    const dispatch = useAppDispatch()

    const { theme, toggleTheme } = useTheme(modal === undefined)

    const [graviola, setGraviola] = useState<Graviola | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    // Contract data
    const [dataFetched, setDataFetched] = useState<boolean>(false)
    const [collection, setCollection] = useState<NFT[]>([])
    const [rarities, setRarities] = useState<RaritiesData | null>(null)

    const graviolaContextValue = {
        contract: graviola,
        collection,
        rarities,
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
            console.log("[App] totalSupply: ", Number(nftTotalSupply))
            const promises = Array.from(
                {
                    length: Number(nftTotalSupply),
                },
                async (_, idx) => {
                    try {
                        const uri = await graviola.tokenURI(BigInt(idx))
                        const response = await fetch(uri)
                        const nftData = await response.json()
                        return {
                            id: idx,
                            ...nftData,
                        }
                    } catch (error) {
                        console.warn('[App]', (error as Error).message.substring(0, 72) + "...")
                        return fallbackNFT
                    }
                },
            )

            // Nfts
            const collection: NFT[] = await Promise.all(promises)
            console.log("[App] fetched collection ", collection) // DEBUG
            collection.length < 5 ? (() => {
                setCollection(new Array(5).fill(fallbackNFT))
                console.warn('Collection is smaller than (5). Using fallback collection')
            })() : setCollection((prev) => [...prev, ...collection])

            const raritiesData = rarityGroupsData.reduce<Record<RarityLevel, RarityGroupData>>((acc, groupData, idx) => {
                const obj = groupData as unknown as RarityGroupData
                const gData: RarityGroupData = {
                    name: obj.name,
                    color: rarityGroupColors[rarityScale[idx]],
                    keywords: obj.keywords.map(kword => kword),
                    startRange: Number(obj.startRange),
                    endRange: Number(obj.endRange),
                    weight: Number(obj.weight),
                    minTokenWeight: Number(obj.minTokenWeight),
                }
                acc[rarityScale[idx]] = gData
                return acc
            }, {} as Record<RarityLevel, RarityGroupData>)

            console.log("[App] raritiesData: ", raritiesData) // DEBUG
            setRarities(raritiesData)
            setLoading(false)
            console.log('[App] collection loaded!')
        }

        fetchCollection()
        setDataFetched(true)
    }, [graviola])

    useEffect(() => {
        console.log('walletProvider ', walletProvider)
        console.log("env rpc?: ", import.meta.env.VITE_DEV_RPC)

        if (walletProvider) connectContractWallet(walletProvider).then((contract) => setGraviola(contract))
        else if (devWallet) setGraviola(connectContractDevWallet(devWallet))
        else connectContract().then((noWalletContract) => setGraviola(noWalletContract))

        dispatch(setConnectedTrue())
    }, [walletProvider, devWallet])

    return loading ? (
        <Loading />
    ) : (
        <GraviolaContext.Provider value={graviolaContextValue}>
            <AppContext.Provider value={appContextValue}>{props.children}</AppContext.Provider>
        </GraviolaContext.Provider>
    )
}

export default App
