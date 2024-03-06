import './App.css'
import FullscreenContainer from "./components/ui/FullscreenContainer"
import { useEffect, useState } from 'react'
import ContentContainer from "./components/ui/ContentContainer"
import Navbar from "./components/Navbar"
import { createWeb3Modal, defaultConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react'
import HorizontalLine from './components/ui/HorizontalLine'
import Button from './components/ui/Button'
import BlockMarquee from './components/BlockMarquee'
import NFTDetails from './components/ui/NFTDetails'
import { rarities } from './rarityData'
import { useNavigate } from 'react-router-dom'
import { routerPaths } from './router'
import { ethers } from 'ethers'
import GraviolaAbi from "../../contracts/artifacts/contracts/Graviola.sol/Graviola.json"
import { Graviola } from '../../contracts/typechain-types/contracts/Graviola'
import { RarityData, RarityLevel } from './types/rarity'
import { getRarityBorder, getRarityColor } from './utils/getRarityBorder'
import BlockNFT from './components/ui/BlockNFT'

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


const nftSources1 = [
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
]

const nftSources2 = [
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
]

const nftSources3 = [
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
    "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
]

const GRAVIOLA_CONTRACT_ADDRESS = "0x799eE17b920928c6FbdcbdF40DD2718717f9c87E"

async function connectContract(walletProvider: ethers.providers.ExternalProvider):Promise<Graviola> {
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const graviola = new ethers.Contract(GRAVIOLA_CONTRACT_ADDRESS, GraviolaAbi.abi, signer)
    return graviola as unknown as Graviola
}

function App() {

    const navigate = useNavigate()
    const [marqueeInit, setMarqueeInit] = useState<boolean>(false)
    const [graviola, setGraviola] = useState<Graviola>()
    // const [isContractReady, setIsContractReady] = useState<boolean>(false)

    // Init NFT marquee opacity animation
    useEffect(() => {
        if (marqueeInit) return
        setMarqueeInit(true)
    })

    const { isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()
    

    useEffect(() => {
        if(isConnected && walletProvider) {
            connectContract(walletProvider).then(contract => setGraviola(contract))        }
    }, [isConnected, walletProvider])

    useEffect(() => {
        if(graviola) graviola.tokenURI(0n).then(uri => console.log(uri))
    }, [graviola])

    return (
        <FullscreenContainer>

            <Navbar />


            <ContentContainer additionalClasses='gap-2 flex-col'>

                <div className='flex flex-col mt-28 p-4 gap-2'>
                    <h1 className='font-bold text-2xl'>Your own dynamically generated NFT character portrait.</h1>
                    <h2 className='font-bold text-xl opacity-85'>Roll a new one every 24h. Collect, Share, Sell, and more!</h2>
                    <HorizontalLine />

                    <div className='flex flex-col gap-4 w-1/3 m-auto my-10'>
                        <Button text='Get yours now!' onClick={() => navigate(routerPaths.generate)} />
                        <Button text='Browse marketplace' onClick={() => { }} />
                    </div>

                    <div className={`bg-light-bgDark dark:bg-dark-bgDark
                        flex flex-col rounded-xl py-4 border-2 border-light-border dark:border-dark-border`}
                    >
                        <div className={`flex flex-col
                        transition-opacity duration-4000 ease-in-out
                        ${marqueeInit ? "opacity-100" : "opacity-0"}
                        `}>
                            <BlockMarquee nftSources={nftSources1} />
                            <BlockMarquee nftSources={nftSources2} />
                            <BlockMarquee nftSources={nftSources3} />
                        </div>
                    </div>

                    <div className='flex flex-col mt-14 p-4 gap-2'></div>

                        <h1 className='font-bold text-2xl'>Inspect and see all the details.</h1>
                        <h2 className='font-bold text-xl opacity-85'>Some keywords are much rarer than others!</h2>
                        <HorizontalLine />
                        <br />

                        <NFTDetails
                            nftProps={{
                                src: "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
                                glow: true,
                                rarityLevel: RarityLevel.VeryRare,
                            }}
                            upperBubbleChildren={<NFTDetailsUpper rarity={RarityLevel.VeryRare} />}
                            lowerBubbleChildren={<NFTDetailsLower />}
                        />

                        <HorizontalLine />
                        <br />

                        <div className='flex gap-8 justify-center items-center my-20'>
                            {Object.keys(rarities).map((rarityLevel) => <BlockNFT src='https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io' glow={true} rarityLevel={rarityLevel as RarityLevel} additionalClasses='w-24 h-24'/> )}
                        </div>


                </div>

            </ContentContainer>

        </FullscreenContainer>
    )
}

const NFTDetailsUpper = (props: {rarity: RarityLevel}) => {
    return (
        <p className='font-semibold'>Rarity: <span className='font-bold underline' style={getRarityColor(props.rarity)}>{rarities[props.rarity].name.toUpperCase()}</span></p>
    )
}

const NFTDetailsLower = () => {
    const NFTMetadata = {
        id: "09568490868045680456",
        someOtherStuff: "yeyeyyee",
        rarity: "0.00001337%",
        owner: "Me"
    }

    return (
        <div className='font-semibold text-sm'>
            <pre className='whitespace-pre-wrap text-left overflow-x-auto'>
                <span>{JSON.stringify(NFTMetadata, null, 2)}</span>
            </pre>
        </div>
    )
}

export default App
