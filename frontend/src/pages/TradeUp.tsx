import Button from "../components/ui/Button"
import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import ContentContainer from "../components/ui/layout/ContentContainer"
import Navbar from "../components/nav/Navbar"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import { useContext, useEffect, useState } from "react"
import { GraviolaContext } from "../contexts/GraviolaContext"
import { NFT } from "../types/NFT"
import { RaritiesData } from "../types/RarityGroup"
import { clsx as cl } from "clsx"
import { ethers, isCallException, toBigInt } from "ethers"
import { getRarityFromPerc } from "../utils/getRarityData"
import { formatBpToPercentage } from "../utils/format"
import BlockNFT from "../components/BlockNFT"
import { convertToIfpsURL } from "../utils/convertToIpfsURL"
import ResultText from "../components/ui/ResultText"
import { RarityLevel } from "../types/Rarity"
import GenerateContainer from "../components/ui/layout/GenerateContainer"
import { TransactionStatus } from "../types/TransactionStatus"
import { tradeUpTxStatusMessages } from "../utils/statusMessages"
import { NFTExt } from "./Generate"
import { Graviola } from "../../../contracts/typechain-types/Graviola"
import { parseEther } from "ethers"
import PageTitle from "../components/ui/layout/PageTitle"
import SectionContainer from "../components/ui/layout/SectionContainer"
// import { fallbackNFT } from "../utils/fallbackNFT";

const TradeUp = () => {
    const graviolaContext = useContext(GraviolaContext)
    const { isConnected, address } = useWeb3ModalAccount()
    const rGroups = graviolaContext.rarities as RaritiesData
    const contractNFTs = graviolaContext.collection as NFT[]

    // const contractNFTs: NFT[] = Array(16).fill(fallbackNFT) // DEBUG

    const [ownedTokenIds, setOwnedTokensIds] = useState<Array<number>>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [progressState, setProgressState] =
        useState<TransactionStatus>("NONE")
    const [progressMessage, setProgressMessage] = useState<string>(
        tradeUpTxStatusMessages["NONE"],
    )
    const [progressBarVal, setProgressBarVal] = useState<number>(0)
    const [rolledNFT, setRolledNFT] = useState<NFTExt>()
    const isPreGenerationState = ["NONE", "CONFIRM_TX", "TX_REJECTED"].includes(
        progressState,
    )

    const [selectedIds, setSelectedIds] = useState<Array<number>>([])
    const [selectedGroup, setSelectedGroup] = useState<RarityLevel | null>(null)
    const contentReady = !isLoading && isConnected

    // Generation state listener
    const progressListener = () => {
        if (!isConnected) return
        const graviola = graviolaContext.contract as Graviola

        const onMint = (addr: string, tokenId: bigint) => {
            if (addr != address) return

            console.log(`[info] onMint: addr ${addr}, tokenId ${tokenId}`)
            setProgressState("MINTED")
            setProgressBarVal(50)
        }

        const onTokenReady = async (addr: string, tokenId: bigint) => {
            if (addr != address) return

            console.log(`[info] onTokenReady: addr ${addr}, tokenId ${tokenId}`)
            const uri = await graviola.tokenURI(tokenId)
            const response = await fetch(uri)
            const nft: NFT = await response.json()
            const [rarityLevel, rarityData] = getRarityFromPerc(
                formatBpToPercentage(nft.attributes[0].value),
            )

            setProgressState("DONE")
            setProgressBarVal(100)

            const nftRes: NFTExt = {
                ...nft,
                rarityLevel: rarityLevel,
                rarityData: rarityData,
            }

            setRolledNFT(nftRes)
        }

        graviola.on(graviola.filters.Mint, onMint)
        graviola.on(graviola.filters.TokenReady, onTokenReady)

        return () => {
            graviola.off(graviola.filters.Mint, onMint)
            graviola.off(graviola.filters.TokenReady, onTokenReady)
        }
    }

    // Fetch contract collections on mount, wallet connect, address change etc
    useEffect(() => {
        ; (async () => {
            let userOwnedTokens
            if (address) {
                userOwnedTokens = await graviolaContext.contract?.ownedTokens(
                    ethers.getAddress(address),
                )
            }
            userOwnedTokens &&
                userOwnedTokens.forEach((token: bigint) => {
                    setOwnedTokensIds((prev) => [...prev, Number(token)])
                })
            // console.log(ownedTokensIds)
            setIsLoading(false)
        })()
    }, [isConnected, address])

    // Init listeners for the contract
    useEffect(() => {
        progressListener()
    }, [])

    // Progress state text updater
    useEffect(() => {
        setProgressMessage(tradeUpTxStatusMessages[progressState])
    }, [progressState])

    return (
        <FullscreenContainer>
            <Navbar />
            <ContentContainer additionalClasses="flex-col gap-4 h-full flex-grow">

                <PageTitle title="Trade Up" />

                {!contentReady
                    ? (
                        <SectionContainer additionalClasses="self-center w-fit justify-center">
                            {isLoading
                                ? <p>Loading...</p>
                                : <p>You need to connect your wallet first!</p>
                            }
                        </SectionContainer>
                    ) : (
                        <div className="flex flex-col gap-3 justify-between items-center h-full flex-grow">
                            <div className={cl(
                                "flex w-full h-full",
                                "divide-x divide-light-border dark:divide-dark-border",
                                "border border-light-border dark:border-dark-border",
                                "rounded-xl"
                            )}>

                                {/* Owned NFTs (Left panel) */}
                                <div className={cl(
                                    "flex basis-2/3",
                                    "flex-col",
                                    "p-6 max-sm:p-3",
                                )}>

                                    <div className="flex-grow w-full h-0 overflow-auto rounded-xl">
                                        <div className="grid grid-cols-3 auto-rows-min gap-4">
                                            {contractNFTs.map((nft: NFT, i) => {
                                                const percRarity =
                                                    formatBpToPercentage(
                                                        nft.attributes[0].value,
                                                    )
                                                const keywordsArray: string[] =
                                                    nft.description
                                                        .split(":")
                                                        .pop()!
                                                        .trim()
                                                        .split(",")
                                                const keywords: string[] =
                                                    keywordsArray.map(
                                                        (keyword) =>
                                                            keyword.trim(),
                                                    )
                                                const [
                                                    rarityLevel,
                                                    rarityData,
                                                ] = getRarityFromPerc(
                                                    percRarity
                                                )

                                                if (
                                                    selectedGroup !== null &&
                                                    selectedGroup !==
                                                    rarityLevel
                                                ) {
                                                    return null
                                                    // } else if (
                                                    // !ownedTokenIds.includes(i)
                                                    // ) {
                                                    // return null
                                                } else {
                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`
                                                                    relative flex w-fit h-fit flex-col justify-center items-center
                                                                    gap-2 bg-light-bgLight/50 dark:bg-dark-bgLight/50
                                                                    border-2 border-light-border dark:border-dark-border
                                                                    p-4 rounded-xl
                                                                `}
                                                        >
                                                            <p
                                                                className={`
                                                                    absolute top-0 left-0 p-2 z-10
                                                                    rounded-xl bg-light-bgPrimary dark:bg-dark-bgPrimary
                                                                    border border-light-border dark:border-dark-border
                                                                `}
                                                            >
                                                                id: {i}
                                                            </p>
                                                            <div
                                                                className={`
                                                                        p-px hover:cursor-pointer
                                                                        ${selectedIds.includes(
                                                                    i,
                                                                )
                                                                        ? "brightness-50 hover:brightness-50"
                                                                        : "hover:brightness-110"
                                                                    }
                                                                        `}
                                                                style={{
                                                                    borderRadius: 16,
                                                                    borderWidth: 2,
                                                                    borderColor:
                                                                        rarityData.color,
                                                                }}
                                                                onClick={() => {
                                                                    const indexOf =
                                                                        selectedIds.indexOf(
                                                                            i,
                                                                        )
                                                                    if (
                                                                        indexOf !==
                                                                        -1
                                                                    ) {
                                                                        if (
                                                                            selectedIds.length ===
                                                                            1
                                                                        )
                                                                            setSelectedGroup(
                                                                                null,
                                                                            )
                                                                        setSelectedIds(
                                                                            (
                                                                                prev,
                                                                            ) =>
                                                                                prev.filter(
                                                                                    (
                                                                                        _id,
                                                                                    ) =>
                                                                                        i !==
                                                                                        _id,
                                                                                ),
                                                                        )
                                                                        return
                                                                    }
                                                                    if (
                                                                        selectedIds.length ===
                                                                        0
                                                                    ) {
                                                                        setSelectedGroup(
                                                                            rarityLevel,
                                                                        )
                                                                    }
                                                                    if (
                                                                        selectedIds.length >=
                                                                        3
                                                                    )
                                                                        return
                                                                    setSelectedIds(
                                                                        (
                                                                            prev,
                                                                        ) => [
                                                                                ...prev,
                                                                                i,
                                                                            ],
                                                                    )
                                                                }}
                                                            >
                                                                <BlockNFT
                                                                    nftData={nft}
                                                                    glowColor={"auto"}
                                                                // additionalClasses={`w-fit h-fit max-w-[14em]`}
                                                                />
                                                            </div>
                                                            <div className="flex flex-col gap-2 justify-center items-center">
                                                                {/* Keywords */}
                                                                <div className="flex flex-wrap gap-1 justify-center items-center">
                                                                    {keywords.map(
                                                                        (
                                                                            keyword: string,
                                                                            i,
                                                                        ) => {
                                                                            return (
                                                                                <div
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className={`
                                                                                    rounded-lg py-1 px-2 border
                                                                                    bg-light-bgPrimary dark:bg-dark-bgPrimary
                                                                                    border-light-border dark:border-dark-border
                                                                                `}
                                                                                >
                                                                                    <p>
                                                                                        {
                                                                                            keyword
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            )
                                                                        },
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    </div>




                                </div>

                                {/* TradeUp Result (Right panel) */}
                                <div className={cl(
                                    "flex basis-1/3",
                                    "justify-center items-center",
                                    "p-6 max-sm:p-3"
                                )}>
                                    The panel thing
                                </div>

                            </div>

                            {/* Controls & Info (Bottom panel) */}
                            <SectionContainer additionalClasses="justify-between items-center">

                                <p>
                                    <span>Status: </span>
                                    <span className={cl(
                                        "p-3 rounded-xl",
                                        "bg-light-border/75 dark:bg-dark-border/75"
                                    )}>
                                        STATUS_TEXT
                                    </span>
                                </p>

                                <Button
                                    text="Trade"
                                    disabled={false}
                                    onClick={() => { }}
                                />
                            </SectionContainer>
                        </div>
                    )
                }
            </ContentContainer>
        </FullscreenContainer>
    )
}

export default TradeUp
