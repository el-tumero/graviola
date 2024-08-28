import Button from "../components/ui/Button"
import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import ContentContainer from "../components/ui/layout/ContentContainer"
import Navbar from "../components/nav/Navbar"
import { useEffect, useState } from "react"
import { NFT } from "../types/NFT"
import { clsx as cl } from "clsx"

import BlockNFT from "../components/BlockNFT"
import { RarityLevel } from "../data/rarities"

import PageTitle from "../components/ui/layout/PageTitle"
import SectionContainer from "../components/ui/layout/SectionContainer"
import { cn } from "../utils/cn"
import useRandomRarityBorder from "../hooks/useBorderAnimation"
import { Status } from "../types/Status"
import useGenerateNFT from "../hooks/useGenerateNFT"
import useWallet from "../hooks/useWallet"
import { useAppSelector } from "../redux/hooks"
import { tradeUpTxStatusMessages } from "../utils/statusMessages"

const TradeUp = () => {
    const { collectionContract, isConnected, address } = useWallet()

    const collection = useAppSelector(
        (state) => state.graviolaData.collection,
    ) as NFT[]

    const {
        // txStatus,
        txMsg,
        // rolledNFT,
    } = useGenerateNFT(tradeUpTxStatusMessages)

    const [ownedTokenIds, setOwnedTokensIds] = useState<Array<number>>([])
    const [status, setStatus] = useState<Status>("loading")
    const [selectedIds, setSelectedIds] = useState<Array<number>>([])
    const [selectedGroup, setSelectedGroup] = useState<RarityLevel | null>(null)
    const contentReady = status === "ready" && isConnected

    // Select an NFT as a trade component
    const handleNFTClick = (idx: number, rarityLevel: RarityLevel) => {
        const indexOf = selectedIds.indexOf(idx)
        if (indexOf !== -1) {
            if (selectedIds.length === 1) setSelectedGroup(null)
            setSelectedIds((prev) => prev.filter((_id) => idx !== _id))
            return
        }
        if (selectedIds.length === 0) {
            setSelectedGroup(rarityLevel)
        }
        if (selectedIds.length >= 3) return
        setSelectedIds((prev) => [...prev, idx])
    }

    // Clicking an active trade component in the right panel should unselect it
    const handleSelectedNFTClick = (idx: number) => {
        const indexOf = selectedIds.indexOf(idx)
        if (indexOf !== -1) {
            if (selectedIds.length === 1) setSelectedGroup(null)
            setSelectedIds((prev) => prev.filter((_id) => idx !== _id))
            return
        }
    }

    // Fetch contract collections on mount, wallet connect, address change etc
    useEffect(() => {
        ;(async () => {
            if (address) {
                console.log("Hello!")
                // TODO: fix this
                const userOwnedTokensBalance =
                    await collectionContract.balanceOf(address)

                const userOwnedTokens = []

                for (let i = 0; i < userOwnedTokensBalance; i++) {
                    userOwnedTokens.push(
                        Number(
                            await collectionContract.tokenOfOwnerByIndex(
                                address,
                                i,
                            ),
                        ),
                    )
                }

                setOwnedTokensIds(userOwnedTokens)
            }
            setStatus("ready")
        })()
    }, [address])

    return (
        <FullscreenContainer>
            <Navbar />
            <ContentContainer additionalClasses="flex-col gap-4 h-full">
                <PageTitle title="Trade Up" />

                {!contentReady ? (
                    <SectionContainer additionalClasses="self-center w-fit justify-center">
                        {status === "loading" ? (
                            <p>Loading...</p>
                        ) : (
                            <p>You need to connect your wallet first!</p>
                        )}
                    </SectionContainer>
                ) : (
                    <div className="flex flex-col gap-3 justify-between items-center h-full flex-grow">
                        <div
                            className={cl(
                                "flex w-full h-full rounded-xl",
                                "divide-x divide-light-border dark:divide-dark-border",
                                "border border-light-border dark:border-dark-border",
                                "max-sm:flex-wrap max-sm:flex-col max-sm:divide-y",
                            )}
                        >
                            {/* Owned NFTs (Left panel) */}
                            <div
                                className={cl(
                                    "flex basis-2/3",
                                    "flex-col",
                                    "p-6 max-sm:p-3",
                                )}
                            >
                                <OwnedNFTsPanel
                                    collection={collection}
                                    selectedGroup={selectedGroup}
                                    ownedTokenIds={ownedTokenIds}
                                    onNFTClick={handleNFTClick}
                                    selectedIds={selectedIds}
                                />
                            </div>

                            {/* TradeUp Result (Right panel) */}
                            <div
                                className={cl(
                                    "flex max-md:flex-col basis-1/3",
                                    "justify-center items-center",
                                    "p-6 max-sm:p-3",
                                )}
                            >
                                {selectedIds.length === 0 ? (
                                    <p>Select the NFTs you want to trade</p>
                                ) : (
                                    <TradeUpGenerateContainer
                                        active={selectedIds.length === 3}
                                    >
                                        {selectedIds.map((id, i) => {
                                            // const randBase = Math.random()
                                            // const randRotate =
                                            //     Math.floor(randBase * 30) + 1 // 15-60deg rotate
                                            // const randSign =
                                            //     randBase < 0.5 ? -1 : 1
                                            return (
                                                <div
                                                    key={i}
                                                    className={cl(
                                                        "flex justify-center items-center",
                                                        "w-16 h-16 rounded-xl",
                                                        "bg-light-bgPrimary dark:bg-dark-bgPrimary",
                                                        "border border-light-border dark:border-dark-border",
                                                        "hover:cursor-pointer",
                                                    )}
                                                    // style={{
                                                    //     ...getRarityBorder(
                                                    //         rGroupData,
                                                    //         true,
                                                    //     ).style,
                                                    //     zIndex: `${selectedIds.length}`,
                                                    //     rotate: `${randSign * randRotate}deg`,
                                                    // }}
                                                    onClick={() =>
                                                        handleSelectedNFTClick(
                                                            id,
                                                        )
                                                    }
                                                >
                                                    <BlockNFT
                                                        nftData={collection[id]}
                                                        glowColor="none"
                                                        additionalClasses="w-12 h-12"
                                                        disableMetadataOnHover
                                                    />
                                                </div>
                                            )
                                        })}
                                    </TradeUpGenerateContainer>
                                )}
                            </div>
                        </div>

                        {/* Controls & Info (Bottom panel) */}
                        <SectionContainer additionalClasses="justify-between items-center">
                            <div className="flex flex-wrap justify-center items-center">
                                <span>Status: </span>
                                <span
                                    className={cl(
                                        "p-3 max-sm:mt-3 rounded-xl",
                                        "bg-light-border/75 dark:bg-dark-border/75",
                                    )}
                                >
                                    {txMsg}
                                </span>
                            </div>

                            <Button
                                text="Trade"
                                disabled={false}
                                onClick={() => {
                                    console.log("Request GEN")
                                }}
                                additionalClasses={
                                    selectedIds.length === 3
                                        ? "border border-light-text/25 dark:border-dark-text/25"
                                        : "border-none"
                                }
                            />
                        </SectionContainer>
                    </div>
                )}
            </ContentContainer>
        </FullscreenContainer>
    )
}

// Owned NFTs (left panel)
const OwnedNFTsPanel = (props: {
    collection: NFT[]
    selectedGroup: RarityLevel | null
    ownedTokenIds: number[]
    onNFTClick: (idx: number, rarityLevel: RarityLevel) => void
    selectedIds: number[]
}) => {
    return (
        <div className={cl("flex-grow w-full h-0 overflow-auto", "rounded-xl")}>
            <div
                className={cl(
                    "grid gap-3 auto-rows-min",
                    "max-sm:grid-cols-3",
                    "max-md:grid-cols-4 md:grid-cols-5",
                )}
            >
                {" "}
                {props.collection.map((nft: NFT, i) => {
                    const keywordsArray: string[] = nft.description
                        .split(":")
                        .pop()!
                        .trim()
                        .split(",")
                    const keywords: string[] = keywordsArray.map((keyword) =>
                        keyword.trim(),
                    )
                    if (
                        props.selectedGroup !== null &&
                        props.selectedGroup !== nft.rarityGroup
                    ) {
                        return null
                    } else if (!props.ownedTokenIds.includes(i)) {
                        return null
                    } else {
                        return (
                            <div
                                key={i}
                                onClick={() =>
                                    props.onNFTClick(i, nft.rarityGroup)
                                }
                                className={cn(
                                    // Fancy NFT hover selection animations & borders
                                    "flex flex-col justify-center items-center rounded-xl",
                                    "gap-2 cursor-pointer hover:cursor-pointer",
                                    "border border-light-border dark:border-dark-border rounded-xl",
                                    "hover:border-light-text/40 dark:hover:border-dark-text/40",
                                    "hover:scale-95 transition-transform duration-300",
                                    props.selectedIds.includes(i)
                                        ? "opacity-50 scale-95"
                                        : "opacity-100",
                                )}
                            >
                                <div className={cl("m-4")}>
                                    <BlockNFT
                                        nftData={nft}
                                        glowColor={"auto"}
                                        disableMetadataOnHover
                                        additionalClasses={`w-fit h-fit max-w-[12em]`}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 justify-center items-center">
                                    {/* Keywords */}
                                    <KeywordBlocks keywords={keywords} />
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    )
}

// Wrapper (ready = 3/3 Tokens selected)
const TradeUpGenerateContainer = (props: {
    children: React.ReactNode
    active: boolean
}) => {
    const rarityAnimBorder = useRandomRarityBorder(true, 750)
    return (
        <div
            className={cl(
                "flex w-full h-full justify-center items-center",
                "p-3 rounded-xl",
                "bg-light-bgLight/25 dark:bg-dark-bgLight/25",
                "border border-light-border dark:border-dark-border border-dashed",
            )}
            style={props.active ? rarityAnimBorder : {}}
        >
            {props.children}
        </div>
    )
}

const KeywordBlocks = (props: { keywords: string[] }) => {
    return (
        <div className="flex flex-wrap gap-1 justify-center items-center text-sm mx-1 mb-3">
            {props.keywords.map((keyword: string, idx: number) => {
                return (
                    <div
                        key={idx}
                        className={cl(
                            "rounded-lg py-1 px-1.5 border",
                            "border-light-border dark:border-dark-border",
                        )}
                    >
                        <p>{keyword}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default TradeUp
