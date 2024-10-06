import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import ContentContainer from "../components/ui/layout/ContentContainer"
import Navbar from "../components/nav/Navbar"
import { useEffect, useRef, useState } from "react"
import { clsx as cl } from "clsx"
import { NFT } from "../types/NFT"
import Button from "../components/ui/Button"
import BlockNFT from "../components/BlockNFT"
import { cn } from "../utils/cn"
import PageTitle from "../components/ui/layout/PageTitle"
import icons from "../data/icons"
import SectionContainer from "../components/ui/layout/SectionContainer"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { rarityColors } from "../data/rarities"
import camelToPascal from "../utils/camelToPascal"
import { fetchCollection, fetchUserCollection } from "../web3"
import { setCollection, setUserCollection } from "../redux/reducers/graviola"
import useWallet from "../hooks/useWallet"

type DropFilterMode = "Everyone's Drops" | "My Drops"

const Drops = () => {
    // TODO: MAINNET: Add options to filter by Rarity, or by included Keywords.
    const { isConnected, address } = useWallet()
    const collection = useAppSelector((state) => state.graviolaData.collection)
    const collectionTotalSupply = useAppSelector(
        (state) => state.graviolaData.collectionTotalSupply,
    )

    const userCollection = useAppSelector(
        (state) => state.graviolaData.userCollection,
    )

    const dispatch = useAppDispatch()

    const [filterMode, setFilterMode] =
        useState<DropFilterMode>("Everyone's Drops")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [fetchingCollection, setFetchingCollection] = useState<boolean>(false)
    const [backToTopVisible, setBackToTopVisible] = useState<boolean>(false)

    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const contentReady = !isLoading && isConnected

    const fetchUserOwnedTokens = async () => {
        setFetchingCollection(true)
        if (address && userCollection === undefined) {
            const owned = await fetchUserCollection(address)
            dispatch(setUserCollection(owned))
        }
        setIsLoading(false)
        setFetchingCollection(false)
    }

    useEffect(() => {
        if (filterMode === "My Drops") {
            fetchUserOwnedTokens()
        }
    }, [filterMode])

    const scrollToTop = () => {
        scrollContainerRef.current?.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    const loadMore = async () => {
        const loaded = collection.length

        const collectionData = await fetchCollection(
            loaded,
            loaded + 6 > collectionTotalSupply
                ? collectionTotalSupply
                : loaded + 6,
        )

        dispatch(setCollection(collection.concat(collectionData)))
    }

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const scrollThresholdPerc = 20
                const scrollTop = scrollContainerRef.current.scrollTop
                const scrollHeight = scrollContainerRef.current.scrollHeight
                const clientHeight = scrollContainerRef.current.clientHeight
                const scrolledPercentage =
                    (scrollTop / (scrollHeight - clientHeight)) * 100

                if (scrolledPercentage < scrollThresholdPerc) {
                    setBackToTopVisible(false)
                    return
                }

                setBackToTopVisible(true)
            }
        }

        const scrollContainer = scrollContainerRef.current
        scrollContainer?.addEventListener("scroll", handleScroll)

        return () =>
            scrollContainer?.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <FullscreenContainer ref={scrollContainerRef}>
            <Navbar />

            <ContentContainer additionalClasses="flex-col gap-4">
                <PageTitle title="Drops" />

                {!contentReady ? (
                    <SectionContainer additionalClasses="self-center w-fit justify-center">
                        {isLoading ? (
                            <p>Fetching drops...</p>
                        ) : (
                            <p>You need to connect your wallet to see Drops</p>
                        )}
                    </SectionContainer>
                ) : (
                    <>
                        <div
                            className={cl(
                                "flex justify-between items-center",
                                "max-sm:flex-col max-sm:gap-3 max-sm:mt-3 p-3 rounded-xl",
                                "border border-light-border dark:border-dark-border",
                            )}
                        >
                            <div className="flex flex-wrap gap-1.5 max-sm:mt-3">
                                <p>Showing:</p>
                                <p>
                                    <span
                                        className={cl(
                                            "font-normal font-content p-3 rounded-xl",
                                            "bg-light-border/50 dark:bg-dark-border/50",
                                        )}
                                    >
                                        {filterMode.toLowerCase()}
                                    </span>
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    text="Refresh"
                                    onClick={() => fetchUserOwnedTokens()}
                                    disabled={fetchingCollection}
                                />
                                <Button
                                    text={`See ${filterMode === "My Drops" ? "all drops" : "my drops only"}`}
                                    onClick={() => {
                                        const invertedCollectionMode =
                                            filterMode === "My Drops"
                                                ? "Everyone's Drops"
                                                : "My Drops"
                                        setFilterMode(invertedCollectionMode)
                                    }}
                                />
                            </div>
                        </div>

                        <div
                            className={cl(
                                "grid gap-4 w-full",
                                "max-sm:grid-cols-2",
                                "max-md:grid-cols-3 md:grid-cols-4",
                                "xl:grid-cols-6",
                            )}
                        >
                            <CollectionList
                                contractNFTs={
                                    filterMode === "Everyone's Drops"
                                        ? collection
                                        : userCollection === undefined
                                          ? []
                                          : userCollection
                                }
                            />
                            {/* Scroll to Top Button */}
                            {backToTopVisible && (
                                <div className="flex absolute bottom-0 right-0 w-12 h-12 mx-10 my-6 bg-transparent">
                                    <div
                                        className={cn(
                                            "flex w-12 h-12 p-3 justify-center items-center hover:cursor-pointer",
                                            "rounded-lg bg-light-bgPrimary dark:bg-dark-bgPrimary",
                                            "border border-light-border dark:border-dark-border",
                                            "hover:bg-light-border/75 dark:hover:bg-dark-border/75",
                                            "-rotate-90",
                                        )}
                                        onClick={() => scrollToTop()}
                                    >
                                        {icons.arrow}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex mx-auto my-6">
                            {collection.length != collectionTotalSupply && (
                                <div
                                    className={cn(
                                        "rounded-xl p-3 text-base cursor-pointer ",
                                        "bg-light-bgLight dark:bg-dark-bgLight",
                                        "border border-light-border dark:border-dark-border",
                                        "dark:hover:bg-neutral-700",
                                    )}
                                    onClick={loadMore}
                                >
                                    Load more...
                                </div>
                            )}
                        </div>
                    </>
                )}
            </ContentContainer>
        </FullscreenContainer>
    )
}

const CollectionList = (props: { contractNFTs: Array<NFT> }) => {
    return (
        <>
            {props.contractNFTs.map((nft: NFT, idx) => {
                const keywordsArray: string[] = nft.description
                    .split(":")
                    .pop()!
                    .trim()
                    .split(",")
                const keywords: string[] = keywordsArray.map((keyword) =>
                    keyword.trim(),
                )

                return (
                    <div
                        key={idx}
                        className={cl(
                            "flex flex-col justify-between items-center",
                            "gap-3 p-3 rounded-xl",
                            "border border-light-border dark:border-dark-border",
                        )}
                    >
                        {/* Preview */}
                        <div
                            className="p-px"
                            style={{
                                borderRadius: 16,
                                borderWidth: 1,
                            }}
                        >
                            <BlockNFT
                                nftData={nft}
                                glowColor={"auto"}
                                additionalClasses={`w-fit h-fit max-w-[14em]`}
                            />
                        </div>

                        {/* Stats, info */}
                        <div
                            className={cl(
                                "flex flex-col gap-1 h-full justify-between items-between",
                            )}
                        >
                            <div
                                className={cl(
                                    "flex flex-col w-full h-fit gap-1",
                                    "justify-start items-start",
                                )}
                            >
                                <p>id: {nft.id}</p>
                                <p>
                                    Rarity:&nbsp;
                                    <span
                                        className={"font-normal"}
                                        style={{
                                            color: rarityColors[
                                                nft.rarityGroup
                                            ],
                                        }}
                                    >
                                        {camelToPascal(nft.rarityGroup)}
                                    </span>
                                </p>
                            </div>
                            <div
                                className={cl(
                                    "flex flex-wrap w-full h-fit",
                                    "gap-1 justify-start items-start",
                                )}
                            >
                                {keywords.map((keyword, idx) => (
                                    <span
                                        className={cl(
                                            "py-1 px-2 rounded-md",
                                            "bg-light-bgLight/75 dark:bg-dark-bgLight/75",
                                        )}
                                        key={idx}
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}
export default Drops
