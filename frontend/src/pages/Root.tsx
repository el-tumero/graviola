import { useNavigate } from 'react-router-dom'
import FullscreenContainer from "../components/ui/FullscreenContainer"
import { useContext, useEffect, useState } from 'react'
import { NFT } from '../types/NFT'
import ContentContainer from "../components/ui/ContentContainer"
import Navbar from "../components/Navbar"
import Button from '../components/ui/Button'
import BlockMarquee from '../components/BlockMarquee'
import NFTDetails from '../components/ui/NFTDetails'
import { rarities } from '../rarityData'
import { routerPaths } from '../router'
import { RarityLevel } from '../types/Rarity'
import { getRarityColor } from '../utils/getRarityBorder'
import { GraviolaContext } from '../contexts/GraviolaContext'
import { convertToIfpsURL } from '../utils/convertToIpfsURL'
import BlockNFT from '../components/ui/BlockNFT'
import { getRarityPercentageString } from '../utils/getRarityPercentage'
import SectionTitle from '../components/ui/SectionTitle'
import OraIoBanner from '../components/ui/OraIoBanner'
import Link from '../components/Link'
import fallbackNFT from "../assets/fallbackNFT.png"
import { getRarityFromThreshold } from '../utils/getRarityDataFromThreshold'

function Root() {

    const navigate = useNavigate()
    const [marqueeInit, setMarqueeInit] = useState<boolean>(false)

    const graviolaContext = useContext(GraviolaContext)
    const nftSources = graviolaContext.collection as NFT[]
    const fallbackNfts: NFT[] = [{
        image: fallbackNFT,
        description: "This is a fallback NFT image. Go generate some!",
        attributes: [{
            "trait_type": "Rarity",
            "value": 8332
        }]
    }]

    // Change this to 3 different-sized arrays once we have more data to work with
    const marqueeSources = nftSources.map((nft: NFT) => (
        convertToIfpsURL(nft.image)
    ))

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
                        <div className='flex max-lg:flex-col justify-center items-center gap-4 w-full px-4 mt-4 mb-8'>
                            <Button enabled={true} text='Get yours now!' onClick={() => navigate(routerPaths.generate)} />
                            <Button enabled={true} text='Browse collection' onClick={() => navigate(routerPaths.collection)} />
                        </div>
                        <div className={`bg-light-bgDark/50 dark:bg-dark-bgDark/50
                            flex flex-col rounded-xl py-4 border-2 border-light-border dark:border-dark-border`}
                        >
                            <div className={`flex flex-col
                            transition-opacity duration-4000 ease-in-out
                            ${marqueeInit ? "opacity-100" : "opacity-0"}
                            `}>
                                <BlockMarquee nftSources={marqueeSources || fallbackNfts} />
                                <BlockMarquee nftSources={marqueeSources || fallbackNfts} />
                                <BlockMarquee nftSources={marqueeSources || fallbackNfts} />
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
                            src: convertToIfpsURL(nftSources[0].image || fallbackNfts[0].image),
                            glow: true,
                            rarityLevel: getRarityFromThreshold(nftSources[0].attributes[0].value)[0] || RarityLevel.Rare,
                        }}
                        upperBubbleChildren={<NFTDetailsUpper rarity={getRarityFromThreshold(nftSources[0].attributes[0].value)[0] || RarityLevel.Rare} />}
                        lowerBubbleChildren={<NFTDetailsLower metadata={nftSources[0].attributes || fallbackNfts[0].attributes} />}
                    />

                    <SectionTitle
                        mainText={{
                            content: "Feeling lucky?"
                        }}
                        secondaryText={{
                            content: "Check out the chances for each rarity level"
                        }}
                    />
                    <div className='xl:flex xl:justify-center sm:grid sm:grid-cols-2 sm:gap-16 mt-6 mb-20'>
                        {Object.keys(rarities).map((rarityLevel, i) => (
                            <div className='flex flex-col gap-1 justify-center items-center' key={i}>
                                <BlockNFT src={convertToIfpsURL(nftSources[0].image)} glow={true} rarityLevel={rarityLevel as RarityLevel} additionalClasses='xl:w-[8em] xl:h-[8em] sm:w-[10em] sm:h-[10em]' />
                                <div className='flex flex-col justify-center items-center w-fit h-fit p-2 my-1'>
                                    <p className='font-bold' style={{color: getRarityColor(rarityLevel as RarityLevel)}}>{rarities[rarityLevel as RarityLevel].name}</p>
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
                        <div className='flex flex-col gap-2 mb-24 p-4'>
                            <div className='flex'>
                                <Link text='Ora' href={"https://www.ora.io/"} additionalClasses='font-bold' />
                                <p>&nbsp;is an on-chain verifiable oracle protocol</p>
                            </div>
                            <p>A verifiable oracle protocol allows a user to perform verifiable operations in a truly decentralized environment.</p>
                            <p>This means easy AI inference for the user and for the developer.</p>
                        </div>
                    </OraIoBanner>

                </div>

            </ContentContainer>

        </FullscreenContainer>
    )
}

const NFTDetailsUpper = (props: { rarity: RarityLevel }) => {
    return (
        <p className='font-semibold'>Rarity: <span className='font-bold' style={{color: getRarityColor(props.rarity)}}>{rarities[props.rarity].name.toUpperCase()}</span></p>
    )
}

const NFTDetailsLower = (props: {metadata: Object}) => {
    return (
        <div className='font-semibold text-sm'>
            <pre className='whitespace-pre-wrap text-left overflow-x-auto'>
                <span>{JSON.stringify(props.metadata, null, 2)}</span>
            </pre>
        </div>
    )
}

export default Root