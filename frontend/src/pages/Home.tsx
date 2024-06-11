import { useNavigate } from "react-router-dom"
import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import { useContext, useEffect, useState } from "react"
import { NFT } from "../types/NFT"
import ContentContainer from "../components/ui/layout/ContentContainer"
import Navbar from "../components/nav/Navbar"
import AutoBlockNFT from "../components/AutoBlockNFT"
import SectionContainer from "../components/ui/layout/SectionContainer"
import { routerPaths } from "../router"
import { GraviolaContext } from "../contexts/GraviolaContext"
import BlockNFT from "../components/BlockNFT"
import SectionTitle from "../components/ui/layout/SectionTitle"
import { RaritiesData } from "../types/RarityGroup"
import { clsx as cl } from "clsx"
import icons from "../icons"
import { RarityGroupData, RarityLevel } from "../types/Rarity"
import MetadataMock, {
    MetadataMockProperty,
} from "../components/ui/MetadataMock"

function Home() {
    const navigate = useNavigate()
    const [marqueeInit, setMarqueeInit] = useState<boolean>(false)

    const graviolaContext = useContext(GraviolaContext)
    const rGroups = graviolaContext.rarities as RaritiesData
    const nftSources = graviolaContext.collection as NFT[]

    // Init NFT marquee opacity animation
    useEffect(() => {
        if (marqueeInit) return
        setMarqueeInit(true)
    })

    const mockMetaBannerData: MetadataMockProperty[] = [
        {
            name: "image",
            val: "QmQiHyuPLdC49vKDt1rJ1iyFC4SpFFmF7yoDWEXWPfRF7Z",
            comment: "IPFS cid of NFT",
        },
        {
            name: "rarity",
            val: "681472",
            comment: "NFT rarity with 6 digits of precision",
        },
        {
            name: "season",
            val: "Summer 2024",
            comment: "Season during which the NFT was created",
        },
        {
            name: "description",
            val: "Generate a minimalistic portrait of a fictional character. Use a solid color background. The main features of this character are: cyborg, human, android",
            comment: "The prompt used for generation",
        },
    ]

    return (
        <FullscreenContainer>
            <Navbar />

            <ContentContainer additionalClasses="flex-col">
                <div className="flex flex-col mt-12 p-4 gap-3">
                    <SectionContainer>
                        <div
                            className={cl(
                                "flex flex-col gap-1 justify-start items-center",
                                "h-full",
                                "max-sm:w-full max-lg:w-1/3 lg:w-1/2",
                            )}
                        >
                            <h1 className="text-accent font-extrabold text-3xl">
                                Unique dynamically generated character portrait
                                NFTs
                            </h1>
                            <h2 className="text-light-text dark:text-dark-text text-lg">
                                {/* NOTE: mock */}
                                Lorem ipsum dolor, sit amet consectetur
                                adipisicing elit. Nisi tenetur placeat laborum
                                at assumenda nobis? Ipsa animi et, fugiat
                                voluptatibus accusamus, iure quidem voluptatum
                                perferendis neque a voluptates amet ipsum?
                            </h2>
                        </div>

                        <div
                            className={cl(
                                "flex max-sm:justify-center justify-end items-center w-1/2 max-sm:w-full sm:w-1/3",
                            )}
                        >
                            <AutoBlockNFT />
                        </div>
                    </SectionContainer>

                    {/* Header buttons - get yours now, browse collection */}
                    <div>
                        <div
                            className={cl([
                                "flex justify-end items-center gap-4 w-full",
                                "max-sm:flex-col mt-4 mb-8",
                            ])}
                        >
                            <div
                                onClick={() => navigate(routerPaths.generate)}
                                className={cl(
                                    "flex justify-between items-center gap-1.5 p-3 select-none",
                                    "rounded-xl transition-transform duration-300",
                                    "hover:translate-x-2 hover:cursor-pointer",
                                    "border border-accent bg-gradient-to-tr from-accent/25 to-accent/40",
                                )}
                            >
                                <p>Get yours now!</p>
                                {icons.arrowRight}
                            </div>
                            <div
                                onClick={() => navigate(routerPaths.collection)}
                                className={cl(
                                    "flex justify-between items-center gap-1.5 p-3 select-none",
                                    "rounded-xl transition-all duration-300",
                                    "hover:translate-x-2 hover:cursor-pointer",
                                    "border border-transparent",
                                    "hover:border-light-border hover:dark:border-dark-border",
                                )}
                            >
                                <p>Browse Collection</p>
                                {icons.arrowRight}
                            </div>
                        </div>
                    </div>

                    <SectionContainer>
                        <div
                            className={cl(
                                "flex flex-col gap-3 justify-start items-start",
                                "max-sm:w-full w-1/3 h-full text-lg",
                            )}
                        >
                            <SectionTitle
                                title="Inspect to see more details"
                                secondaryContent={
                                    <p>
                                        The metadata object contains valuable
                                        information about your image. Hover any
                                        NFT on this website to see its metadata.
                                        Learn more about meta properties{" "}
                                        <span
                                            onClick={() =>
                                                navigate(routerPaths.generate)
                                            }
                                            className={cl(
                                                "underline underline-offset-2 hover:cursor-pointer hover:decoration-accent",
                                            )}
                                        >
                                            here
                                        </span>
                                    </p>
                                }
                            />
                        </div>
                        <div className={cl("max-sm:w-full w-2/3 h-fit")}>
                            <MetadataMock metadata={mockMetaBannerData} />
                        </div>
                    </SectionContainer>

                    <SectionContainer additionalClasses="my-12">
                        <SectionTitle
                            title="Limited and Rare keywords!"
                            // TODO: Fix this text a little, this is just a demo
                            secondaryContent={`Graviola is driven by the Hodlers, who have the power to vote on the upcoming new seasonal keywords.
                                After each season ends, all of its Rare, Very Rare and Legendary keywords will be banned forever.
                                This ensures your Legendary Graviola NFT is forever rare and grows value with time!
                            `}
                        />
                    </SectionContainer>

                    <SectionContainer additionalClasses="flex-col">
                        <SectionTitle
                            title="Ready to test your luck?"
                            secondaryContent="Discover your odds for each rarity tier!"
                        />
                        <div
                            className={cl(
                                "xl:flex xl:justify-center xl:items-center",
                                "max-xl:justify-items-center w-fit px-12 pt-12 pb-6 rounded-xl",
                                "max-xl:grid max-sm:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3",
                                "xl:gap-12 max-xl:gap-9 max-sm:gap-6",
                                "bg-light-border/50 dark:bg-dark-border/50",
                            )}
                        >
                            {/* TODO: Since blockNFTs have metadata on hover, these should be hardcoded with valid data */}
                            {/* (respective to the rarity levels below them) */}
                            {Object.entries(rGroups).map(
                                (
                                    [rLevel, rarityGroup]: [
                                        string,
                                        RarityGroupData,
                                    ],
                                    i,
                                ) => {
                                    const rarityLevel = rLevel as RarityLevel // Object.entries always returns string keys
                                    return (
                                        <div
                                            className="flex flex-col gap-2 justify-center items-center hover:scale-105 transition-transform duration-300"
                                            key={i}
                                        >
                                            <div>
                                                <BlockNFT
                                                    nftData={nftSources[i]}
                                                    glowColor={rarityLevel}
                                                    additionalClasses="xl:w-[8em] xl:h-[8em] sm:w-[10em] sm:h-[10em]"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center items-center w-fit h-fit">
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
                                },
                            )}
                        </div>
                    </SectionContainer>

                    <SectionContainer>
                        <SectionTitle
                            title="How does Graviola work?"
                            secondaryContent={`
                                Graviola uses Ora, a verifiable oracle protocol, alongside Stable Diffusion 2 to create NFTs on-chain.
                                All processes are decentralized, open-source, and transparent.
                                By leveraging opML capabilities,
                                Graviola can generate NFTs in a trustless manner, meaning you can verify every step of the process.
                                The NFTs are securely stored using decentralized networks like IPFS, making them easily accessible and tamper-proof.
                            `}
                        />
                    </SectionContainer>
                </div>
            </ContentContainer>
        </FullscreenContainer>
    )
}

export default Home
