import { Link, useNavigate } from 'react-router-dom'
import FullscreenContainer from "../components/ui/FullscreenContainer"
import { useContext, useEffect, useState } from 'react'
import ContentContainer from "../components/ui/ContentContainer"
import Navbar from "../components/Navbar"
import Button from '../components/ui/Button'
import BlockMarquee from '../components/BlockMarquee'
import NFTDetails from '../components/ui/NFTDetails'
import { rarities } from '../rarityData'
import { routerPaths } from '../router'
import { RarityLevel } from '../types/rarity'
import { getRarityColor } from '../utils/getRarityBorder'
import BlockNFT from '../components/ui/BlockNFT'
import { getRarityPercentageString } from '../utils/getRarityPercentage'
import SectionTitle from '../components/ui/SectionTitle'
import OraIoBanner from '../components/ui/OraIoBanner'
import { GraviolaContext } from '../contexts/GraviolaContext'

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

const nftSources = []

function convertToIfpsUrl(cid:string) {
    return "https://ipfs.io/ipfs" + cid
}


function Root() {

    const navigate = useNavigate()
    const [marqueeInit, setMarqueeInit] = useState<boolean>(false)

    const graviolaContext = useContext(GraviolaContext)

    useEffect(() => {
        if (graviolaContext.contract) graviolaContext.contract.tokenURI(0n).then(async (uri) => {
            const obj = await (await fetch(uri)).json()
            const url = convertToIfpsUrl(obj.image)
            console.log(url)
            // @ts-ignore
            // console.log(await graviolaContext.contract.totalSupply())
            // console.log(obj)
            
        })
    }, [graviolaContext.contract])

    // Init NFT marquee opacity animation
    useEffect(() => {
        if (marqueeInit) return
        setMarqueeInit(true)
    })

    return (
        <FullscreenContainer>

            <Navbar />


            <ContentContainer additionalClasses='flex-col'>
                <div className='flex flex-col mt-16 p-4 gap-2'>

                    <SectionTitle
                        mainText={{
                            content: "Your own dynamically generated NFT character portrait",
                            additionalClasses: "text-accent"
                        }}
                        secondaryText={{
                            content: "Roll a new one every 24h. Collect, share, sell and more!",
                            additionalClasses: "text-light-textSecondary dark:text-dark-textSecondary"
                        }}
                    />

                    <div className='flex flex-col mb-36'>
                        <div className='flex justify-center items-center gap-4 w-1/2 m-auto mt-4 mb-8'>
                            <Button enabled={true} text='Get yours now!' onClick={() => {navigate(routerPaths.generate)}} />
                            <Button enabled={false} text='Browse marketplace (COMING SOON)' onClick={() => {}} />
                        </div>
                        <div className={`bg-light-bgDark/50 dark:bg-dark-bgDark/50
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
                    </div>

                    <SectionTitle
                        mainText={{
                            content: "Inspect and see all the details",
                        }}
                        secondaryText={{
                            content: "Some keywords are much rarer than others!",
                            additionalClasses: "text-light-textSecondary dark:text-dark-textSecondary"
                        }}
                    />
                    <NFTDetails
                        nftProps={{
                            src: "https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io",
                            glow: true,
                            rarityLevel: RarityLevel.VeryRare,
                        }}
                        upperBubbleChildren={<NFTDetailsUpper rarity={RarityLevel.VeryRare} />}
                        lowerBubbleChildren={<NFTDetailsLower />}
                    />

                    <SectionTitle
                        mainText={{
                            content: "Feeling lucky?"
                        }}
                        secondaryText={{
                            content: "Check out the chances for each rarity level"
                        }}
                    />
                    <div className='xl:flex xl:justify-around sm:grid sm:grid-cols-2 sm:gap-16 mt-6 mb-20'>
                        {Object.keys(rarities).map((rarityLevel, i) => (
                            <div className='flex flex-col gap-1 justify-center items-center' key={i}>
                                <BlockNFT src='https://ipfs.io/ipfs/QmQet2xjVySs6CgrZpwBbXGDacJbexG8Zp5VhMNZU8C5io' glow={true} rarityLevel={rarityLevel as RarityLevel} additionalClasses='xl:w-[10em] xl:h-[10em] sm:w-[12em] sm:h-[12em]' />
                                <div className='flex flex-col justify-center items-center w-fit h-fit p-2 my-1'>
                                    <p className='font-bold' style={getRarityColor(rarityLevel as RarityLevel)}>{rarities[rarityLevel as RarityLevel].name}</p>
                                    <span className='font-bold'>
                                        {getRarityPercentageString(rarityLevel as RarityLevel)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>


                    <SectionTitle
                        mainText={{
                            content: "Fully decentralized",
                        }}
                        secondaryText={{
                            content: "We're using Stable Diffusion 2 to generate our NFTs on-chain",
                            additionalClasses: "text-light-textSecondary dark:text-dark-textSecondary"
                        }}
                    />

                    <OraIoBanner>
                        <p>
                            <Link to={"https://www.ora.io/"}>
                                Ora
                            </Link>
                            {" "} is an on-chain verifiable oracle protocol
                        </p>
                        <p>A verifiable oracle protocol allows a user to perform verifiable operations in a truly decentralized environment.</p>
                        <p>This means easy AI inference for the user and for the developer.</p>
                    </OraIoBanner>

                </div>

            </ContentContainer>

        </FullscreenContainer>
    )
}

const NFTDetailsUpper = (props: { rarity: RarityLevel }) => {
    return (
        <p className='font-semibold'>Rarity: <span className='font-bold' style={getRarityColor(props.rarity)}>{rarities[props.rarity].name.toUpperCase()}</span></p>
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

export default Root