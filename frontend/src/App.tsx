import { useEffect, useState, ReactNode, Fragment } from "react"
import tailwindConfig from "../tailwind.config"
import {
    createWeb3Modal,
    defaultConfig,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"

import { NFT } from "./types/NFT"
import Loading from "./pages/Loading"
import useTheme from "./hooks/useTheme"
import { rarityScale, rarityGroupColors } from "./data/rarityData"
import { RarityLevel, RarityGroupData } from "./types/Rarity"
import { fallbackNFT } from "./data/fallbacks"
import useWallet from "./hooks/useWallet"
import { isDevMode } from "./utils/mode"
import { setCollection, setRarities } from "./redux/reducers/graviola"
import { useAppDispatch } from "./redux/hooks"

const App = (props: { children: ReactNode }) => {
    const modal = createWeb3Modal({
        themeVariables: {
            "--w3m-accent": tailwindConfig.theme.extend.colors.accentDark,
        },
        ethersConfig: defaultConfig({
            metadata: {
                name: "graviola NFT",
                description: "NFT generator powered by opML",
                url: "https://el-tumero.github.io/graviola/",
                icons: [],
            },
        }),
        chains: [
            {
                chainId: 421614,
                name: "Arbitrum Sepolia",
                currency: "ETH",
                explorerUrl: "https://sepolia.etherscan.io/",
                rpcUrl: "https://endpoints.omniatech.io/v1/arbitrum/sepolia/public",
            },
        ],
        projectId: "a09890b34dc1551c2534337dbc22de8c",
    })

    const dispatch = useAppDispatch()
    useTheme(modal === undefined)
    const { walletProvider } = useWeb3ModalProvider()
    const { connectWallet, graviola } = useWallet()
    const [loading, setLoading] = useState<boolean>(true)
    // const [graviolaDataFetched, setGraviolaDataFetched] = useState<boolean>(false)

    // Fetch contract data
    useEffect(() => {
        if (!graviola || !loading) return

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
                        console.warn(
                            "[App]",
                            (error as Error).message.substring(0, 72) + "...",
                        )
                        return fallbackNFT
                    }
                },
            )

            // Nfts
            const collection: NFT[] = await Promise.all(promises)
            console.log("[App] fetched collection ", collection) // DEBUG
            collection.length < 5
                ? (() => {
                      console.warn(
                          "Collection is smaller than (5). Using fallback collection",
                      )
                      dispatch(setCollection(new Array(5).fill(fallbackNFT)))
                  })()
                : dispatch(setCollection(collection))

            const raritiesData = rarityGroupsData.reduce<
                Record<RarityLevel, RarityGroupData>
            >(
                (acc, groupData, idx) => {
                    const obj = groupData as unknown as RarityGroupData
                    const gData: RarityGroupData = {
                        name: obj.name,
                        color: rarityGroupColors[rarityScale[idx]],
                        keywords: obj.keywords.map((kword) => kword),
                        startRange: Number(obj.startRange),
                        endRange: Number(obj.endRange),
                        weight: Number(obj.weight),
                        minTokenWeight: Number(obj.minTokenWeight),
                    }
                    acc[rarityScale[idx]] = gData
                    return acc
                },
                {} as Record<RarityLevel, RarityGroupData>,
            )

            // console.log("[App] raritiesData: ", raritiesData) // DEBUG
            dispatch(setRarities(raritiesData))
            console.log("[App] collection loaded!")

            setLoading(false)
        }

        console.log("[App] Is running in dev mode?: ", isDevMode)
        fetchCollection()
    }, [graviola])

    useEffect(() => {
        if (walletProvider) {
            connectWallet(walletProvider)
        }
    }, [walletProvider])

    return loading ? <Loading /> : <Fragment>{props.children}</Fragment>
}

export default App
