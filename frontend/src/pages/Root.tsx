import { useNavigate } from 'react-router-dom'
import FullscreenContainer from "../components/ui/FullscreenContainer"
import { useContext, useEffect, useState } from 'react'
import { NFT } from '../types/NFT'
import ContentContainer from "../components/ui/ContentContainer"
import Navbar from "../components/Navbar"
import Button from '../components/ui/Button'
import BlockMarquee from '../components/BlockMarquee'
import NFTDetails from '../components/ui/NFTDetails'
import { routerPaths } from '../router'
import { GraviolaContext } from '../contexts/GraviolaContext'
import { convertToIfpsURL } from '../utils/convertToIpfsURL'
import BlockNFT from '../components/ui/BlockNFT'
import SectionTitle from '../components/ui/SectionTitle'
import OraIoBanner from '../components/ui/OraIoBanner'
import Link from '../components/Link'
import { getRarityFromPerc } from '../utils/getRarityDataFromThreshold'
import { RaritiesData } from '../types/RarityGroup'
import { fallbackNFT, fallbackNFTRarity } from '../utils/fallbackNFT'
import { splitCollectionToMarquee } from '../utils/splitCollectionToMarquee'
import { clsx as cl } from "clsx"

function Root() {

    const navigate = useNavigate()
    const [marqueeInit, setMarqueeInit] = useState<boolean>(false)

    const graviolaContext = useContext(GraviolaContext)
    const rGroups = graviolaContext.rarities as RaritiesData
    const nftSources = graviolaContext.collection as NFT[]
    const fallbackNfts: NFT[] = Array(16).fill(fallbackNFT)
    const fallbackNftsRariries = Array(16).fill(fallbackNFTRarity)

    const useContractCollection = nftSources.length >= 16
    const [marqueeSources1, marqueeSources2, marqueeSources3] =
        splitCollectionToMarquee(useContractCollection ? nftSources : fallbackNfts)

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
                        <div className={cl([
                            "flex justify-center items-center gap-4 w-full px-4 mt-4 mb-8",
                            "max-lg:flex-col"
                        ])}>
                            <Button enabled={true} text='Get yours now!' onClick={() => navigate(routerPaths.generate)} />
                            <Button enabled={true} text='Browse collection' onClick={() => navigate(routerPaths.collection)} />
                        </div>
                        <div className={cl([
                            "bg-light-bgDark/50 flex flex-col rounded-xl py-4 border-2 border-light-border",
                            "dark:bg-dark-bgDark/50 dark:border-dark-border"
                        ])}
                        >
                            <div className={cl(
                                "flex flex-col transition-opacity duration-4000 ease-in-out",
                                marqueeInit ? "opacity-100" : "opacity-0"
                            )}>
                                <BlockMarquee nftSources={marqueeSources1.map((nft) => convertToIfpsURL(nft.image))} />
                                <BlockMarquee nftSources={marqueeSources2.map((nft) => convertToIfpsURL(nft.image))} />
                                <BlockMarquee nftSources={marqueeSources3.map((nft) => convertToIfpsURL(nft.image))} />
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
                            rarityGroup: getRarityFromPerc(nftSources[0].attributes[0].value, rGroups)[1] || fallbackNftsRariries[0],
                        }}
                        upperBubbleChildren={
                            <NFTDetailsUpper
                                rarityPerc={nftSources[0].attributes[0].value || 5}
                                rGroups={rGroups}
                            />
                        }
                        lowerBubbleChildren={
                            <NFTDetailsLower
                                metadata={nftSources[0].attributes || fallbackNfts[0].attributes}
                            />
                        }
                    />

                    <SectionTitle
                        mainText={{
                            content: "Feeling lucky?"
                        }}
                        secondaryText={{
                            content: "Check out the chances for each rarity level"
                        }}
                    />
                    <div className={cl(
                            "mt-6 mb-20",
                            "xl:flex xl:justify-center",
                            "sm:grid sm:grid-cols-2 sm:gap-16",
                        )}>
                        {Object.entries(rGroups).map(([,rarityGroup], i) => (
                            <div className='flex flex-col gap-1 justify-center items-center' key={i}>
                                <BlockNFT src={convertToIfpsURL(nftSources[i].image)} glow={true} rarityGroup={rarityGroup} additionalClasses='xl:w-[8em] xl:h-[8em] sm:w-[10em] sm:h-[10em]' />
                                <div className='flex flex-col justify-center items-center w-fit h-fit p-2 my-1'>
                                    <p className='font-bold' style={{color: rarityGroup.color }}>{rarityGroup.name}</p>
                                    <span className='font-bold'>
                                        {rarityGroup.rarityPerc}%
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
                                <Link text='Ora' href={"https://www.ora.io/"} additionalClasses='font-bold text-cyan-400 underline' />
                                <p>&nbsp;is an on-chain verifiable oracle protocol</p>
                            </div>
                            <p>A verifiable oracle protocol allows a user to perform verifiable operations (like inferring a deep learning model) on-chain, without sacrificing performance or security.</p>
                            <p>This is a gamechanger. With the AI-onchain being relatively fast, we can build amazing decentralized applications in a more organized, transparent and trustless environment.</p>
                            <p>Every NFT generated on this page was made using on-chain AI and is verifiable!</p>
                        </div>
                    </OraIoBanner>

                </div>

            </ContentContainer>

        </FullscreenContainer>
    )
}

const NFTDetailsUpper = (props: { rarityPerc: number, rGroups: RaritiesData }) => {
    const [,rarityData] = getRarityFromPerc(props.rarityPerc, props.rGroups)
    return (
        <p className='font-semibold'>Rarity: {" "}
            <span className='font-bold' style={{color: rarityData.color }}>
                {rarityData.name.toUpperCase()}
            </span>
        </p>
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