import './App.css'
import FullscreenContainer from "./components/ui/FullscreenContainer"
import { useEffect, useState } from 'react'
import ContentContainer from "./components/ui/ContentContainer"
import Navbar from "./components/Navbar"
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'
import HorizontalLine from './components/ui/HorizontalLine'
import Button from './components/ui/Button'
import BlockMarquee from './components/BlockMarquee'
import BlockNFT from './components/ui/BlockNFT'
import NFTDetails from './components/ui/NFTDetails'

// 1. Get projectId
const projectId = 'YOUR_PROJECT_ID'

// 2. Set chains
const mainnet = {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
}

// 3. Create modal
const metadata = {
    name: 'My Website',
    description: 'My Website description',
    url: 'https://mywebsite.com', // origin must match your domain & subdomain
    icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: [mainnet],
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

function App() {

    const [marqueeInit, setMarqueeInit] = useState<boolean>(false)

    // Init NFT marquee opacity animation
    useEffect(() => {
        if (marqueeInit) return
        setMarqueeInit(true)
    })

    return (
        <FullscreenContainer>

            <Navbar />


            <ContentContainer additionalClasses='gap-2 flex-col'>

                <div className='flex flex-col mt-28 p-4 gap-2'>
                    <h1 className='font-bold text-2xl'>Your own dynamically generated NFT character portrait.</h1>
                    <h2 className='font-bold text-xl opacity-85'>Roll a new one every 24h. Collect, Share, Sell, and more!</h2>
                    <HorizontalLine />

                    <div className='flex flex-col gap-4 w-1/3 m-auto my-10'>
                        <Button text='Get yours now!' onClick={() => { }} />
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
                        <br />

                        <NFTDetails
                            nftProps={{
                                src: "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
                                id: "rare"
                            }}
                            upperBubbleChildren={<NFTDetailsUpper />}
                            lowerBubbleChildren={<NFTDetailsLower />}
                        />

                </div>

            </ContentContainer>

        </FullscreenContainer>
    )
}

const NFTDetailsUpper = () => {
    return (
        <p className='font-semibold'>Rarity: <span className='text-purple-700 underline'>EPIC</span></p>
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
        <div className='font-semibold'>
            <pre className='whitespace-pre-wrap text-left overflow-x-auto'>
                <span>{JSON.stringify(NFTMetadata, null, 2)}</span>
            </pre>
        </div>
    )
}

export default App
