import { useNavigate } from "react-router-dom"
import { links } from "../links"
import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import { mockMetaBannerData } from "../data/mock"
import ContentContainer from "../components/ui/layout/ContentContainer"
import Navbar from "../components/nav/Navbar"
import AutoBlockNFT from "../components/AutoBlockNFT"
import SectionContainer from "../components/ui/layout/SectionContainer"
import { routerPaths } from "../router"
import BlockNFT from "../components/BlockNFT"
import SectionTitle from "../components/ui/layout/SectionTitle"
import { clsx as cl } from "clsx"
import icons from "../data/icons"
import MetadataMock from "../components/ui/MetadataMock"
import LimitedKeywordsScale from "../components/LimitedKeywordsScale"
import { fallbackNFTsRarityList } from "../data/fallbacks"
import Button from "../components/ui/Button"
import { rarities, rarityColors, RarityLevel } from "../data/rarities"
import camelToPascal from "../utils/camelToPascal"
import useArchive from "../hooks/useArchive"
import FeatureCard from "../components/ui/FeatureCard"

const Home = () => {
    const navigate = useNavigate()

    const { groupSizes } = useArchive()

    return (
        <FullscreenContainer>
            <Navbar />

            <ContentContainer additionalClasses="flex-col">
                <div className="flex flex-col p-4 gap-3">
                    <SectionContainer additionalClasses="border-none justify-center text-center">
                        <h1 className="text-accent font-semibold text-3xl">
                            Graviola is a community-driven NFT collection of
                            <br />
                            randomly AI-generated characters
                        </h1>
                    </SectionContainer>

                    <SectionContainer>
                        <div
                            className={cl(
                                "flex flex-col justify-between items-center w-full",
                                "md:flex-row md:items-start",
                            )}
                        >
                            <div className={cl("flex mb-4 md:w-3/5 md:mb-0")}>
                                <h2 className="text-light-text dark:text-dark-text text-xl">
                                    Graviola is a collection that utilizes decentralized
                                    and trustless solutions to ensure full
                                    verifiability and security throughout the
                                    generation process. The project is governed
                                    by a community (DAO) that has the power to
                                    modify the keyword pool used for character
                                    generation and adjust the operation of the
                                    entire Graviola ecosystem.
                                </h2>
                            </div>
                            <div
                                className={cl(
                                    "flex max-sm:justify-center justify-end items-center",
                                )}
                            >
                                <AutoBlockNFT />
                            </div>
                        </div>
                    </SectionContainer>

                    <SectionContainer additionalClasses="border-none justify-center text-center mb-64">
                        <Button
                            text="Browse Drops"
                            onClick={() => navigate(routerPaths.drops)}
                            additionalClasses={`hover:translate-x-2 hover:cursor-pointer`}
                            arrowIcon={true}
                        />
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
                    </SectionContainer>

                    {/* Features */}
                    <SectionContainer>
                        <div
                            className={cl(
                                "flex flex-col gap-6 w-full justify-between items-center",
                                "lg:flex-row",
                            )}
                        >
                            <FeatureCard
                                icon="verified"
                                title="Verifiable Process"
                                content="The whole process of token generation is recorded on-chain, so anyone can check its validity. Thanks to opML (provided in OAO by ORA), it is possible to verify the correctness of AI inference—whether the correct model with the correct prompt was called and executed."
                                accentColor="#2f4d5c"
                            />

                            <FeatureCard
                                icon="valueGrowth"
                                title="Limited Keywords"
                                content="Every character is generated from a prompt that includes keywords chosen by our community in seasonal votings. To make things more interesting, the most demanded keywords occur only in one season, making them time-limited!"
                                accentColor="#4b2752"
                            />

                            <FeatureCard
                                icon="openSeaLogo"
                                title="Rich Metadata"
                                content="Every character is described through its metadata, which provides information about the image, rarity, and input prompt of a token."
                                accentColor="#306148"
                            />
                        </div>
                    </SectionContainer>

                    <SectionContainer additionalClasses="mt-12">
                        <div
                            className={cl(
                                "flex flex-col gap-3 justify-start items-start",
                                "max-sm:w-full w-1/3 h-full text-lg",
                            )}
                        >
                            <SectionTitle
                                title="Rich Metadata"
                                secondaryContent={
                                    <p className="text-lg leading-6 opacity-85">
                                        The metadata object contains valuable
                                        information about your character.
                                        Graviola supports the official ERC721
                                        (OpenSea) metadata standard for all
                                        tokens. Metadata is entirely stored
                                        on-chain. Learn more about meta
                                        properties{" "}
                                        <span
                                            onClick={() =>
                                                navigate(routerPaths.generate)
                                            }
                                            className={cl(
                                                "underline underline-offset-2 hover:cursor-pointer hover:decoration-accent",
                                            )}
                                        >
                                            {/* TODO: (MAINNET) Make static page with All metadata attributes listed and explained */}
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
                            title="Limited Keywords"
                            secondaryContent={`Token holders have the power to shape the future of Graviola. 
                                Every season, you can vote on and suggest new keywords in the Voting Panel.
                                The top 100 keywords will be introduced in the next Season of Graviola.
                                Basic keywords can move between Common and Uncommon groups. They can also occur in multiple seasons,
                                if the Hodlers choose to keep them.
                                At the end of each season, all Rare, Very Rare, and Legendary keywords will be retired forever, 
                                guaranteeing the exclusivity and increasing the value of your Graviola NFTs over time!
                            `}
                        />
                        <LimitedKeywordsScale />
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
                                "bg-light-border/30 dark:bg-dark-border/30",
                            )}
                        >
                            {/* Display one preview NFT of each Rarity Level */}
                            {rarities.map((rarity: RarityLevel, i) => {
                                return (
                                    <div
                                        className="flex flex-col gap-2 justify-center items-center hover:scale-105 transition-transform duration-300"
                                        key={i}
                                    >
                                        <div>
                                            <BlockNFT
                                                nftData={
                                                    fallbackNFTsRarityList[i]
                                                }
                                                glowColor={rarity}
                                                additionalClasses="xl:w-[8em] xl:h-[8em] sm:w-[10em] sm:h-[10em]"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center items-center w-fit h-fit">
                                            <p
                                                className="mt-2 font-normal font-content"
                                                style={{
                                                    color: rarityColors[rarity],
                                                }}
                                            >
                                                {camelToPascal(rarity)}
                                            </p>
                                            <span>{groupSizes[i]}%</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </SectionContainer>

                    <SectionContainer additionalClasses="my-12">
                        <SectionTitle
                            title="Verifiable Process"
                            secondaryContent={
                                <p className="text-lg leading-6 opacity-85">
                                    Graviola uses Onchain AI Oracle created by{" "}
                                    <span className="text-cyan-400">ORA</span> —
                                    a verifiable AI oracle protocol, alongside
                                    Stable Diffusion 2 to dynamically create
                                    NFTs on-chain. All processes are
                                    decentralized, open-source, and transparent.
                                    By leveraging opML capabilities and
                                    blockchain technology, Graviola can generate
                                    new collection tokens in a trustless manner,
                                    meaning you can verify every step of the
                                    process.
                                </p>
                            }
                        />
                        <div className="w-min justify-end items-center">
                            <div
                                onClick={() =>
                                    window.open(
                                        links.ora,
                                        "_blank",
                                        "noopener,noreferrer",
                                    )
                                }
                                className={cl(
                                    "flex w-fit h-fit gap-1 justify-center items-center cursor-pointer",
                                    "py-6 px-3 rounded-xl hover:bg-light-border/30 dark:hover:bg-dark-border/30",
                                    "border border-light-border dark:border-dark-border",
                                    "transition-colors duration-300",
                                    "hover:border-cyan-400 dark:hover:border-cyan-400",
                                )}
                            >
                                {icons.oraLogo}
                            </div>
                        </div>
                    </SectionContainer>

                    <SectionContainer additionalClasses="my-12">
                        <SectionTitle
                            title="Join our community!"
                            secondaryContent={
                                <p className="text-lg leading-6 opacity-85">
                                    Join our Discord and become part of an
                                    exciting community of <b>on-chain AI NFT</b>{" "}
                                    enthusiasts! Whether you&#39;re a seasoned
                                    collector or just getting started, we want
                                    you to have fun and connect with others!
                                </p>
                            }
                        />
                        <div
                            onClick={() =>
                                window.open(
                                    links.discord,
                                    "_blank",
                                    "noopener,noreferrer",
                                )
                            }
                            className={cl(
                                "flex w-fit h-fit p-3 rounded-xl cursor-pointer",
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
