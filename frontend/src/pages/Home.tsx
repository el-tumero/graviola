import { useNavigate } from "react-router-dom"
import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import { useContext, useEffect, useState } from "react"
import { NFT } from "../types/NFT"
import ContentContainer from "../components/ui/layout/ContentContainer"
import Navbar from "../components/nav/Navbar"
import SectionContainer from "../components/ui/layout/SectionContainer"
import Button from "../components/ui/Button"
import NFTDetails from "../components/ui/NFTDetails"
import { routerPaths } from "../router"
import { GraviolaContext } from "../contexts/GraviolaContext"
import { convertToIfpsURL } from "../utils/convertToIpfsURL"
import BlockNFT from "../components/ui/BlockNFT"
import SectionTitle from "../components/ui/layout/SectionTitle"
import OraIoBanner from "../components/ui/OraIoBanner"
import Link from "../components/Link"
import { getRarityFromPerc } from "../utils/getRarityData"
import { RaritiesData } from "../types/RarityGroup"
import { fallbackNFT, fallbackNFTRarity } from "../utils/fallbackNFT"
import { splitCollectionToMarquee } from "../utils/splitCollectionToMarquee"
import { clsx as cl } from "clsx"
import icons from "../icons"
import { RarityGroupData, RarityLevel } from "../types/Rarity"

function Home() {
    const navigate = useNavigate()
    const [marqueeInit, setMarqueeInit] = useState<boolean>(false)

    const graviolaContext = useContext(GraviolaContext)
    const rGroups = graviolaContext.rarities as RaritiesData
    const nftSources = graviolaContext.collection as NFT[]
    const fallbackNfts: NFT[] = Array(16).fill(fallbackNFT)
    const fallbackNftsRariries = Array(16).fill(fallbackNFTRarity)

    const useContractCollection = nftSources.length >= 16
    const [marqueeSources1, marqueeSources2, marqueeSources3] =
        splitCollectionToMarquee(
            useContractCollection ? nftSources : fallbackNfts,
        )

    // Init NFT marquee opacity animation
    useEffect(() => {
        if (marqueeInit) return
        setMarqueeInit(true)
    })


    // NOTE: mock, temporarily here
    interface MetadataProperty {
        name: string
        val: string
        comment?: string
    }
    const mockMetadataObject: MetadataProperty[] = [
        {
            name: "image",
            val: "QmQiHyuPLdC49vKDt1rJ1iyFC4SpFFmF7yoDWEXWPfRF7Z",
            comment: "IPFS cid of NFT"
        },
        {
            name: "rarity",
            val: "681472",
            comment: "NFT rarity with 6 digits of precision"
        },
        {
            name: "season",
            val: "Summer 2024",
            comment: "Season during which the NFT was created"
        },
        {
            name: "description",
            val: "Generate a minimalistic portrait of a fictional character. Use a solid color background. The main features of this character are: cyborg, human, android",
            comment: "The prompt used for generation"
        },
    ]

    return (
        <FullscreenContainer>
            <Navbar />

            <ContentContainer additionalClasses="flex-col">
                <div className="flex flex-col mt-12 p-4 gap-3">

                    <SectionContainer>
                        <div className={cl(
                            "flex flex-col w-1/2 justify-start items-center",
                            "h-full gap-3",
                            "max-sm:w-full"
                        )}>
                            <h1 className="text-accent font-extrabold leading-9 text-3xl">
                                Unique dynamically generated character portrait NFTs
                            </h1>
                            <h2 className="text-light-text dark:text-dark-text leading-9 text-xl">
                                {/* NOTE: mock */}
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nisi tenetur placeat laborum at assumenda nobis? Ipsa animi et, fugiat voluptatibus accusamus, iure quidem voluptatum perferendis neque a voluptates amet ipsum?
                            </h2>
                        </div>

                        <div className={cl(
                            "flex max-sm:justify-center justify-end items-center w-1/2 max-sm:w-full sm:w-1/3"
                        )}>
                            {/* NOTE: mock */}
                            <img className="rounded-xl max-w-64 max-h-64" src={convertToIfpsURL(nftSources.find((nft) => nft.attributes[0].value < 5)?.image || fallbackNFT.image)} />
                        </div>
                    </SectionContainer>

                    {/* Header buttons - get yours now, browse collection */}
                    <div>
                        <div
                            className={cl([
                                "flex justify-end items-center gap-4 w-full mt-4 mb-8",
                                "max-sm:flex-col",
                            ])}
                        >
                            <div onClick={() => navigate(routerPaths.generate)} className={cl(
                                "flex justify-between items-center gap-1.5 p-3 select-none",
                                "rounded-xl transition-transform duration-300",
                                "hover:translate-x-2 hover:cursor-pointer",
                                "border border-accent bg-gradient-to-tr from-accent/25 to-accent/40"
                            )}>
                                <p>Get yours now!</p>
                                {icons.arrowRight}
                            </div>
                            <div onClick={() => navigate(routerPaths.collection)} className={cl(
                                "flex justify-between items-center gap-1.5 p-3 select-none",
                                "rounded-xl transition-transform duration-300",
                                "hover:translate-x-2 hover:cursor-pointer",
                            )}>
                                <p>Browse Collection</p>
                                {icons.arrowRight}
                            </div>
                        </div>
                    </div>

                    <div className={cl(
                        "flex justify-between items-center",
                        "w-full h-fit p-6 rounded-xl",
                        "max-sm:flex-col gap-6 max-sm:gap-6",
                        "border border-light-border dark:border-dark-border"
                    )}>
                        <div className={cl(
                            "flex flex-col gap-3 justify-start items-start",
                            "max-sm:w-full w-1/3 h-full text-xl",
                        )}>
                            <p className="font-bold text-2xl">Inspect to see more details</p>
                            <p>
                                The metadata object contains valuable information about your image.
                                Hover any NFT on this website to see its metadata.
                                Learn more about meta properties{" "}
                                <span onClick={() => navigate(routerPaths.home)} className={cl(
                                    "underline underline-offset-2 hover:cursor-pointer",
                                )}>
                                    here
                                </span>
                            </p>
                        </div>

                        <div className={cl("max-sm:w-full w-2/3 h-fit")}>
                            <div className={cl(
                                "font-mono rounded-xl break-words",
                                "my-8 max-sm:my-0",
                            )}>
                                {/* NOTE: mock */}
                                {"{"}
                                {mockMetadataObject.map((property, idx) => (
                                    <div className="ml-6" key={idx}>
                                        <p>
                                            <span className="text-violet-600 font-semibold">"{property.name}":{" "}
                                                <span className="text-sky-400">"{property.val}"{" "}</span>
                                            </span>
                                            {property.comment &&
                                                <span className="text-stone-500">{`// ${property.comment}`}</span>
                                            }
                                        </p>
                                    </div>
                                ))}
                                {"}"}
                            </div>
                        </div>
                    </div>

                    <SectionContainer additionalClasses="flex-col mt-24">
                        <div className="flex w-full flex-col justify-start items-start">
                            <p className="text-2xl font-bold">
                                Ready to test your luck?
                            </p>
                            <p className="text-xl">
                                Discover your odds for each rarity tier!
                            </p>
                        </div>
                        <div
                            className={cl(
                                "my-6 w-full",
                                "xl:flex xl:justify-center xl:items-center",
                                "max-xl:justify-items-center",
                                "max-xl:grid max-sm:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3",
                                "xl:gap-10 max-xl:gap-6 max-sm:gap-3"
                            )}
                        >
                            {Object.entries(rGroups).map(([rLevel, rarityGroup]: [string, RarityGroupData], i) => {
                                const rarityLevel = rLevel as RarityLevel // Object.entries always returns string keys
                                return (
                                    <div
                                        className="flex flex-col gap-2 justify-center items-center"
                                        key={i}
                                    >
                                        <BlockNFT
                                            nftData={nftSources[i]}
                                            glowColor={rarityLevel}
                                            additionalClasses="xl:w-[8em] xl:h-[8em] sm:w-[10em] sm:h-[10em]"
                                        />
                                        <div className="flex flex-col justify-center items-center w-fit h-fit p-2 my-1">
                                            <p
                                                className="font-bold"
                                                style={{
                                                    color: rarityGroup.color,
                                                }}
                                            >
                                                {rarityGroup.name}
                                            </p>
                                            <span className="font-bold">
                                                {rarityGroup.rarityPerc}%
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </SectionContainer>

                    <SectionTitle
                        mainText={{
                            content: "Fully decentralized",
                        }}
                        secondaryText={{
                            content:
                                "We're using Stable Diffusion 2 to generate our NFTs on-chain",
                            additionalClasses:
                                "text-light-textSecondary dark:text-dark-textSecondary",
                        }}
                    />

                    <OraIoBanner>
                        <div className="flex flex-col gap-2 mb-24 p-4">
                            <div className="flex">
                                <Link
                                    text="Ora"
                                    href={"https://www.ora.io/"}
                                    additionalClasses="font-bold text-cyan-400 underline"
                                />
                                <p>
                                    &nbsp;is an on-chain verifiable oracle
                                    protocol
                                </p>
                            </div>
                            <p>
                                A verifiable oracle protocol allows a user to
                                perform verifiable operations (like inferring a
                                deep learning model) on-chain, without
                                sacrificing performance or security.
                            </p>
                            <p>
                                This is a gamechanger. With the AI-onchain being
                                relatively fast, we can build amazing
                                decentralized applications in a more organized,
                                transparent and trustless environment.
                            </p>
                            <p>
                                Every NFT generated on this page was made using
                                on-chain AI and is verifiable!
                            </p>
                        </div>
                    </OraIoBanner>
                </div>
            </ContentContainer>
        </FullscreenContainer>
    )
}

export default Home
