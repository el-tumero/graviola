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
import icons from "../data/icons"
import { RarityGroupData, RarityLevel } from "../types/Rarity"
import MetadataMock, { MetadataMockProperty } from "../components/ui/MetadataMock"
import LimitedKeywordsScale from "../components/LimitedKeywordsScale"
import Button from "../components/ui/Button"

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
                            <h1 className="text-accent font-title font-semibold text-3xl">
                                Unique, dynamically generated character portrait NFTs
                            </h1>
                            <h2 className="text-light-text dark:text-dark-text text-lg">
                                Own a piece of our limited-time, algorithmically generated character NFTs! Each one is a fun, unique
                                creation blending art and tech. It's like collecting digital trading cards with a twist. Dive in, grab a
                                quirky NFT, and join our chill community of enthusiasts
                            </h2>
                        </div>

                        <div className={cl("flex max-sm:justify-center justify-end items-center w-1/2 max-sm:w-full sm:w-1/3")}>
                            <AutoBlockNFT />
                        </div>
                    </SectionContainer>

                    {/* Header buttons - get yours now, browse collection */}
                    <div>
                        <div className={cl(["flex justify-end items-center gap-4 w-full", "max-sm:flex-col mt-4 mb-8"])}>
                            <Button
                                text="Get yours now!"
                                onClick={() => navigate(routerPaths.generate)}
                                additionalClasses={`
                                    hover:translate-x-2 hover:cursor-pointer
                                    border border-accent bg-gradient-to-tr from-accent/25 to-accent/40
                                    hover:border-accent dark:hover:border-accent
                                `}
                                arrowIcon={true}
                            />
                            <Button
                                text="Browse Drops"
                                onClick={() => navigate(routerPaths.drops)}
                                additionalClasses={`
                                    hover:translate-x-2 hover:cursor-pointer
                                `}
                                arrowIcon={true}
                            />
                        </div>
                    </div>

                    <SectionContainer>
                        <div className={cl("flex flex-col gap-3 justify-start items-start", "max-sm:w-full w-1/3 h-full text-lg")}>
                            <SectionTitle
                                title="Inspect to see more details"
                                secondaryContent={
                                    <p>
                                        The metadata object contains valuable information about your image. Hover any NFT on this website to
                                        see its metadata. Learn more about meta properties{" "}
                                        <span
                                            onClick={() => navigate(routerPaths.generate)}
                                            className={cl("underline underline-offset-2 hover:cursor-pointer hover:decoration-accent")}
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

                    <SectionContainer additionalClasses="flex-col my-12">
                        <SectionTitle
                            title="Seasonal Keywords"
                            secondaryContent={`Token holders have the power to shape the future of Graviola. 
                                Every season, you can vote on and suggest new keywords in the Voting Panel.
                                The top hundred keywords will be introduced in the next Season of GraviolaNFT.
                                Basic keywords can move between Common and Uncommon groups. They can also occur in multiple seasons,
                                if the Hodlers choose to keep them.
                                At the end of each season, all Rare, Very Rare, and Legendary keywords will be retired forever, 
                                guaranteeing the exclusivity and increasing the value of your Graviola NFTs over time!
                            `}
                        />
                        <LimitedKeywordsScale />
                    </SectionContainer>

                    <SectionContainer additionalClasses="flex-col">
                        <SectionTitle title="Ready to test your luck?" secondaryContent="Discover your odds for each rarity tier!" />
                        <div
                            className={cl(
                                "xl:flex xl:justify-center xl:items-center",
                                "max-xl:justify-items-center w-fit px-12 pt-12 pb-6 rounded-xl",
                                "max-xl:grid max-sm:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3",
                                "xl:gap-12 max-xl:gap-9 max-sm:gap-6",
                                "bg-light-border/30 dark:bg-dark-border/30",
                            )}
                        >
                            {/* TODO: Since blockNFTs have metadata on hover, these should be hardcoded with valid data */}
                            {/* (respective to the rarity levels below them) */}
                            {Object.entries(rGroups).map(([rLevel, rarityGroup]: [string, RarityGroupData], i) => {
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
                                                className="mt-2 font-normal font-content"
                                                style={{
                                                    color: rarityGroup.color,
                                                }}
                                            >
                                                {rarityGroup.name}
                                            </p>
                                            <span>{rarityGroup.rarityPerc}%</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </SectionContainer>

                    <SectionContainer additionalClasses="flex-col my-12">
                        <SectionTitle
                            title="How does Graviola work?"
                            secondaryContent={`
                                Graviola uses Ora, a verifiable oracle protocol, alongside Stable Diffusion 2 to create NFTs on-chain.
                                All processes are decentralized, open-source, and transparent.
                                By leveraging opML capabilities,
                                Graviola can generate NFTs in a trustless manner, meaning you can verify every step of the process.
                                The NFTs are securely stored using decentralized networks like IPFS, making them easily accessible and tamperproof
                            `}
                        />
                        <div className="flex w-full justify-end items-center">
                            <div
                                onClick={() => window.open("https://github.com/el-tumero/graviola", "_blank", "noopener,noreferrer")}
                                className={cl(
                                    "flex gap-2 justify-center items-center cursor-pointer",
                                    "p-3 rounded-xl hover:bg-light-border/30 dark:hover:bg-dark-border/30",
                                    "border border-light-border dark:border-dark-border",
                                    "transition-colors duration-300",
                                    "hover:border-cyan-400 dark:hover:border-cyan-400",
                                )}
                            >
                                <p>read more about</p>
                                {icons.oraLogo}
                            </div>
                        </div>
                    </SectionContainer>

                    <SectionContainer additionalClasses="my-12">
                        <SectionTitle
                            title="Join our community!"
                            secondaryContent={`
                                Join our Discord and become part of an exciting community of NFT enthusiasts!
                                Whether you're a seasoned collector or just getting started, we want you to have fun and connect with others
                            `}
                        />
                        <div
                            onClick={() => window.open("https://github.com/el-tumero/graviola", "_blank", "noopener,noreferrer")}
                            className={cl(
                                "w-fit h-fit p-3 rounded-xl cursor-pointer",
                                "hover:bg-light-border/30 dark:hover:bg-dark-border/30",
                                "border border-light-border dark:border-dark-border",
                                "transition-colors duration-300",
                                "hover:border-blue-500 dark:hover:border-blue-500",
                            )}
                        >
                            {icons.discordBannerLogo}
                        </div>
                    </SectionContainer>
                </div>
            </ContentContainer>
        </FullscreenContainer>
    )
}

export default Home
