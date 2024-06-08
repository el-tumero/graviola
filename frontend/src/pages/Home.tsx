import { useNavigate } from "react-router-dom"
import FullscreenContainer from "../components/ui/FullscreenContainer"
import { useContext, useEffect, useState } from "react"
import { NFT } from "../types/NFT"
import ContentContainer from "../components/ui/ContentContainer"
import Navbar from "../components/nav/Navbar"
import Button from "../components/ui/Button"
import NFTDetails from "../components/ui/NFTDetails"
import { routerPaths } from "../router"
import { GraviolaContext } from "../contexts/GraviolaContext"
import { convertToIfpsURL } from "../utils/convertToIpfsURL"
import BlockNFT from "../components/ui/BlockNFT"
import SectionTitle from "../components/ui/SectionTitle"
import OraIoBanner from "../components/ui/OraIoBanner"
import Link from "../components/Link"
import { getRarityFromPerc } from "../utils/getRarityDataFromThreshold"
import { RaritiesData } from "../types/RarityGroup"
import { fallbackNFT, fallbackNFTRarity } from "../utils/fallbackNFT"
import { splitCollectionToMarquee } from "../utils/splitCollectionToMarquee"
import { clsx as cl } from "clsx"
import icons from "../icons"

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
            val: "QmQiHyuPLdC49vKDt1rJ1iyFC4Sp...",
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
                <div className="flex flex-col mt-16 p-4 gap-2">

                    <div className={cl(
                        "flex justify-between items-center",
                        "w-full h-fit p-6 rounded-xl",
                        "max-sm:flex-col gap-6 max-sm:gap-6",
                        "border border-light-border dark:border-dark-border"
                    )}>
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
                            "flex w-1/2 max-sm:w-full sm:w-1/3"
                        )}>
                            {/* NOTE: mock */}
                            <img className="rounded-xl" src={convertToIfpsURL(nftSources.find((nft) => nft.attributes[0].value < 5)!.image)} />
                        </div>
                    </div>

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
                                <p>Get yours now</p>
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
                                Learn more about meta properties
                                <span className="font-bold">{" "}here</span>
                            </p>
                        </div>

                        <div className={cl("max-sm:w-full w-2/3 h-fit")}>
                            <div className={cl(
                                "font-mono p-3 rounded-xl break-words",
                                "border border-light-border dark:border-dark-border"
                            )}>
                                {/* NOTE: mock */}
                                {"{"}
                                {mockMetadataObject.map((property) => (
                                    <div className="ml-6">
                                        <p>
                                            <span className="text-purple-600 font-semibold">{property.name}:{" "}
                                                <span className="text-sky-600">{property.val}{" "}</span>
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

                    <SectionTitle
                        mainText={{
                            content: "Feeling lucky?",
                        }}
                        secondaryText={{
                            content:
                                "Check out the chances for each rarity level",
                        }}
                    />
                    <div
                        className={cl(
                            "mt-6 mb-20",
                            "xl:flex xl:justify-center",
                            "sm:grid sm:grid-cols-2 sm:gap-16",
                        )}
                    >
                        {Object.entries(rGroups).map(([, rarityGroup], i) => (
                            <div
                                className="flex flex-col gap-1 justify-center items-center"
                                key={i}
                            >
                                <BlockNFT
                                    src={convertToIfpsURL(nftSources[i].image)}
                                    glow={true}
                                    rarityGroup={rarityGroup}
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
                        ))}
                    </div>

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

const NFTDetailsUpper = (props: {
    rarityPerc: number
    rGroups: RaritiesData
}) => {
    const [, rarityData] = getRarityFromPerc(props.rarityPerc, props.rGroups)
    return (
        <p className="font-semibold">
            Rarity:{" "}
            <span
                className="font-bold"
                style={{
                    color: rarityData.color,
                }}
            >
                {rarityData.name.toUpperCase()}
            </span>
        </p>
    )
}

const NFTDetailsLower = (props: { metadata: Object }) => {
    return (
        <div className="font-semibold text-sm">
            <pre className="whitespace-pre-wrap text-left overflow-x-auto">
                <span>{JSON.stringify(props.metadata, null, 2)}</span>
            </pre>
        </div>
    )
}

export default Home
