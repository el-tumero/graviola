import Button from "../components/ui/Button"
import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import ContentContainer from "../components/ui/layout/ContentContainer"
import Navbar from "../components/nav/Navbar"
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react"
import { useContext, useEffect, useState } from "react"
import { GraviolaContext } from "../contexts/GraviolaContext"
import { NFT } from "../types/NFT"
import { RaritiesData } from "../types/RarityGroup"
import { clsx as cl } from "clsx"
import { ethers, parseEther } from "ethers"
import { getRarityFromPerc } from "../utils/getRarityData"
import { formatBpToPercentage } from "../utils/format"
import BlockNFT from "../components/BlockNFT"
import { RarityLevel } from "../types/Rarity"
import { TransactionStatus } from "../types/TransactionStatus"
import { tradeUpTxStatusMessages } from "../utils/statusMessages"
import { NFTExt } from "./Generate"
import { Graviola } from "../../../contracts/typechain-types/Graviola"
import PageTitle from "../components/ui/layout/PageTitle"
import SectionContainer from "../components/ui/layout/SectionContainer"
import { cn } from "../utils/cn"
import { getRarityBorder } from "../utils/getRarityBorder"
import useRandomRarityBorder from "../hooks/useBorderAnimation"
import { Status } from "../types/Status"

const ERR_TIMEOUT_MS = 5000

const TradeUp = () => {
    const { isConnected, address } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()
    const {
        contract,
        rarities: rGroups,
        collection,
    } = useContext(GraviolaContext) as {
        contract: Graviola
        rarities: RaritiesData
        collection: NFT[]
    }

    const [ownedTokenIds, setOwnedTokensIds] = useState<Array<number>>([])
    const [status, setStatus] = useState<Status>("loading")

    // Gen data
    const [txStatus, setTxStatus] = useState<TransactionStatus>("NONE")
    const [txMsg, setTxMsg] = useState<string>(tradeUpTxStatusMessages["NONE"])
    // const isPreGenerationState = ["NONE", "CONFIRM_TX", "TX_REJECTED"].includes()
    const [progress, setProgress] = useState<number>(0)
    const [rolledNFT, setRolledNFT] = useState<NFTExt>()

    // const [progressMessage, setProgressMessage] = useState<string>(tradeUpTxStatusMessages["NONE"])
    // const [progressBarVal, setProgressBarVal] = useState<number>(0)
    // const [rolledNFT, setRolledNFT] = useState<NFTExt>()
    // const isPreGenerationState = ["NONE", "CONFIRM_TX", "TX_REJECTED"].includes(progressState)

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
        console.log(indexOf)
        if (indexOf !== -1) {
            if (selectedIds.length === 1) setSelectedGroup(null)
            setSelectedIds((prev) => prev.filter((_id) => idx !== _id))
            return
        }
    }

    const handleTradeUp = async () => {
        setTxStatus("AWAIT_CONFIRM")
        const estFee = (await contract.estimateFee()) as bigint
        try {
            const tx = await contract.mint({
                value: estFee + parseEther("0.01"),
            })
            const receipt = await tx?.wait()
            if (receipt) {
                console.log("receipt OK")
                setTxStatus("BEFORE_MINT")
                setProgress(25)
            }
        } catch (err) {
            setTxStatus("REJECTED")
            setTimeout(() => setTxStatus("NONE"), ERR_TIMEOUT_MS)
            return
        }
    }

    // Generation state listener
    const progressListener = () => {
        if (!walletProvider) return
        const onMint = (addr: string, tokenId: bigint) => {
            if (addr != address) return
            console.log(`[info] onMint: addr ${addr}, tokenId ${tokenId}`)
            setTxStatus("MINTED")
            setProgress(50)
        }

        // TODO: Better err handling. Add some kind of pop-up and try-catch
        const onTokenReady = async (addr: string, tokenId: bigint) => {
            if (addr != address) return

            console.log(`[info] onTokenReady: addr ${addr}, tokenId ${tokenId}`)

            const uri = await contract.tokenURI(tokenId)
            const response = await fetch(uri)
            const nextIdx = collection.length
            const nftData = await response.json()
            const [rLevel, rData] = getRarityFromPerc(nftData.attributes[0].value, rGroups)

            const nftBase: NFT = {
                id: nextIdx,
                ...nftData,
            }

            const nftRes: NFTExt = {
                rarityLevel: rLevel,
                rarityData: rData,
                ...nftBase,
            }

            console.log("[DEBUG] - tradeup Res: ", JSON.stringify(nftRes, null, 4))

            // DEBUG
            // console.log("raw val ", nft.attributes[0].value)
            // console.log("conv bp -> perc ", formatBpToPercentage(nft.attributes[0].value))
            // console.log("rarity ", getRarityFromPerc(formatBpToPercentage(nft.attributes[0].value), rGroups))
            setTxStatus("DONE")
            setProgress(100)
            setRolledNFT(nftRes)
        }

        contract.on(contract.filters.Mint, onMint)
        contract.on(contract.filters.TokenReady, onTokenReady)

        return () => {
            contract.off(contract.filters.Mint, onMint)
            contract.off(contract.filters.TokenReady, onTokenReady)
        }
    }

    // Fetch contract collections on mount, wallet connect, address change etc
    useEffect(() => {
        ; (async () => {
            let userOwnedTokens
            if (address) {
                userOwnedTokens = await contract.ownedTokens(ethers.getAddress(address))
            }
            userOwnedTokens &&
                userOwnedTokens.forEach((token: bigint) => {
                    setOwnedTokensIds((prev) => [...prev, Number(token)])
                })
            // console.log(ownedTokensIds)
            setStatus("ready")
        })()
    }, [isConnected, address])

    // Init listeners for the contract
    useEffect(() => {
        progressListener()
    }, [])

    // Progress state text updater
    useEffect(() => {
        setTxMsg(tradeUpTxStatusMessages[txStatus])
    }, [txStatus])

    return (
        <FullscreenContainer>
            <Navbar />
            <ContentContainer additionalClasses="flex-col gap-4 h-full flex-grow">
                <PageTitle title="Trade Up" />

                {!contentReady ? (
                    <SectionContainer additionalClasses="self-center w-fit justify-center">
                        {status === "loading" ? <p>Loading...</p> : <p>You need to connect your wallet first!</p>}
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
                            <div className={cl("flex basis-2/3", "flex-col", "p-6 max-sm:p-3")}>
                                <div className={cl("flex-grow w-full h-0 overflow-auto", "rounded-xl")}>
                                    <div
                                        className={cl(
                                            "grid gap-3 auto-rows-min",
                                            "max-sm:grid-cols-3",
                                            "max-md:grid-cols-4 md:grid-cols-5",
                                        )}
                                    >
                                        {collection.map((nft: NFT, i) => {
                                            const percRarity = formatBpToPercentage(nft.attributes[0].value)
                                            const keywordsArray: string[] = nft.description.split(":").pop()!.trim().split(",")
                                            const keywords: string[] = keywordsArray.map((keyword) => keyword.trim())
                                            const [rarityLevel] = getRarityFromPerc(percRarity, rGroups)

                                            if (selectedGroup !== null && selectedGroup !== rarityLevel) {
                                                return null
                                            } else if (!ownedTokenIds.includes(i)) {
                                                return null
                                            } else {
                                                return (
                                                    <div
                                                        key={i}
                                                        onClick={() => handleNFTClick(i, rarityLevel)}
                                                        className={cn(
                                                            // Fancy NFT hover selection animations & borders
                                                            "flex flex-col justify-center items-center rounded-xl",
                                                            "gap-2 cursor-pointer hover:cursor-pointer",
                                                            "border border-light-border dark:border-dark-border rounded-xl",
                                                            "hover:border-light-text/40 dark:hover:border-dark-text/40",
                                                            "hover:scale-95 transition-transform duration-300",
                                                            selectedIds.includes(i) ? "opacity-50 scale-95" : "opacity-100",
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
                            </div>

                            {/* TradeUp Result (Right panel) */}
                            <div className={cl("flex max-md:flex-col basis-1/3", "justify-center items-center", "p-6 max-sm:p-3")}>
                                {selectedIds.length === 0 ? (
                                    <p>Select the NFTs you want to trade</p>
                                ) : (
                                    <TradeUpGenerateContainer active={selectedIds.length === 3} rGroups={rGroups}>
                                        {selectedIds.map((id, i) => {
                                            const randBase = Math.random()
                                            const randRotate = Math.floor(randBase * 30) + 1 // 15-60deg rotate
                                            const randSign = randBase < 0.5 ? -1 : 1
                                            const percRarity = formatBpToPercentage(collection[id].attributes[0].value)
                                            const [, rGroupData] = getRarityFromPerc(percRarity, rGroups)
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
                                                    style={{
                                                        ...getRarityBorder(rGroupData, true).style,
                                                        zIndex: `${selectedIds.length}`,
                                                        rotate: `${randSign * randRotate}deg`,
                                                    }}
                                                    onClick={() => handleSelectedNFTClick(id)}
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
                                <span className={cl("p-3 max-sm:mt-3 rounded-xl", "bg-light-border/75 dark:bg-dark-border/75")}>
                                    {txMsg}
                                </span>
                            </div>

                            <Button
                                text="Trade"
                                disabled={false}
                                onClick={() => handleTradeUp()}
                                additionalClasses={
                                    selectedIds.length === 3 ? "border border-light-text/25 dark:border-dark-text/25" : "border-none"
                                }
                            />
                        </SectionContainer>
                    </div>
                )}
            </ContentContainer>
        </FullscreenContainer>
    )
}

// Wrapper (ready = 3/3 Tokens selected)
const TradeUpGenerateContainer = (props: { children: React.ReactNode; active: boolean; rGroups: RaritiesData }) => {
    const rarityAnimBorder = useRandomRarityBorder(true, 750, props.rGroups)
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
                    <div key={idx} className={cl("rounded-lg py-1 px-1.5 border", "border-light-border dark:border-dark-border")}>
                        <p>{keyword}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default TradeUp
