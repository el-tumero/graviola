import { useEffect, useState, ReactNode, Fragment } from "react"
import { isDevMode } from "./utils/mode"
import tailwindConfig from "../tailwind.config"
import {
    createWeb3Modal,
    defaultConfig,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"

import Loading from "./pages/Loading"
import useTheme from "./hooks/useTheme"
import useWallet from "./hooks/useWallet"
import useArchive from "./hooks/useArchive"

import {
    setCollection,
    setCollectionTotalSupply,
} from "./redux/reducers/graviola"
import { useAppDispatch } from "./redux/hooks"
import { fetchCollection } from "./web3"

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
                explorerUrl: "https://sepolia.arbiscan.io",
                rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
            },
        ],
        projectId: "a09890b34dc1551c2534337dbc22de8c",
    })

    const dispatch = useAppDispatch()
    useTheme(modal === undefined)
    const { walletProvider } = useWeb3ModalProvider()
    const { connectWallet, collectionContract } = useWallet()
    const [loading, setLoading] = useState<boolean>(true)

    const { fetchArchive } = useArchive()

    // Fetch contract data
    useEffect(() => {
        if (!loading) return

        console.log("[App] is dev mode: ", isDevMode)

        const fetchContractData = async () => {
            const totalSupply = await collectionContract.totalSupply()
            dispatch(setCollectionTotalSupply(Number(totalSupply)))
            const collectionData = await fetchCollection(
                0,
                totalSupply < 6 ? Number(totalSupply) : 6,
            )
            const nftTotalSupply = await collectionContract.totalSupply()
            await fetchArchive()
            console.log("[App] totalSupply: ", Number(nftTotalSupply))
            console.log("[App] fetched collection ", collectionData)

            dispatch(setCollection(collectionData))
            setLoading(false)
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
