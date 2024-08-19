import { useEffect, useState, ReactNode, Fragment } from "react"
import tailwindConfig from "../tailwind.config"
import {
    createWeb3Modal,
    defaultConfig,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"

import Loading from "./pages/Loading"
import useTheme from "./hooks/useTheme"
import useWallet from "./hooks/useWallet"

import {
    setCollection,
    setGroupSizes,
    setWeights,
} from "./redux/reducers/graviola"
import { useAppDispatch } from "./redux/hooks"
import { fetchCollection, fetchGroupSizes } from "./web3"
import { fallbackNFT } from "./data/fallbacks"

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
    const { connectWallet, collectionContract, seasonsArchiveContract } =
        useWallet()
    const [loading, setLoading] = useState<boolean>(true)

    // Fetch contract data
    useEffect(() => {
        if (!loading) return

        const fetchContractData = async () => {
            const collectionData = await fetchCollection()
            const groupSizes = await fetchGroupSizes()

            const weights = await seasonsArchiveContract.getGroupWeights()
            const nftTotalSupply = await collectionContract.totalSupply()
            console.log("[App] totalSupply: ", Number(nftTotalSupply))
            console.log("[App] fetched collection ", collectionData)

            if (collectionData.length < 5) {
                dispatch(setCollection(new Array(5).fill(fallbackNFT)))
            } else {
                dispatch(setCollection(collectionData))
            }

            dispatch(setGroupSizes(groupSizes))
            dispatch(setWeights(weights.map((w) => Number(w))))

            setLoading(false)
            console.log("[App] collection loaded!")
        }

        fetchContractData()
    }, [loading])

    useEffect(() => {
        if (walletProvider) {
            connectWallet(walletProvider)
        }
    }, [walletProvider])

    return loading ? <Loading /> : <Fragment>{props.children}</Fragment>
}

export default App
