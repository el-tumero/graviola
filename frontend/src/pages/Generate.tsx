import { useState, useEffect, useContext } from "react"
import GenerateContainer from "../components/ui/layout/GenerateContainer"
import Navbar from "../components/nav/Navbar"
import Button from "../components/ui/Button"
import ContentContainer from "../components/ui/layout/ContentContainer"
import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import { NFT } from "../types/NFT"
import { clsx as cl } from "clsx"
import { GraviolaContext } from "../contexts/GraviolaContext"
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react"
import { getRarityFromPerc } from "../utils/getRarityData"
import { generateTxStatusMessages } from "../utils/statusMessages"
import SectionTitle from "../components/ui/layout/SectionTitle"
import { TransactionStatus } from "../types/TransactionStatus"
import { parseEther } from "ethers"
import { Graviola } from "../../../contracts/typechain-types/Graviola"
import { RarityGroupData, RarityLevel } from "../types/Rarity"
import { RaritiesData } from "../types/RarityGroup"
import { routerPaths } from "../router"
import { useNavigate } from "react-router-dom"
import PageTitle from "../components/ui/layout/PageTitle"

const ERR_TIMEOUT_MS = 5000 // How long should display message on err (e.g. rejected tx)

// Extended NFT interface to avoid computing the same properties multiple times
export interface NFTExt extends NFT {
    rarityLevel: RarityLevel
    rarityData: RarityGroupData
}

const Generate = () => {
    const navigate = useNavigate()
    const { walletProvider } = useWeb3ModalProvider()
    const { contract, rarities: rGroups, collection } = useContext(GraviolaContext) as {
        contract: Graviola,
        rarities: RaritiesData,
        collection: NFT[]
    }
    const { isConnected, address } = useWeb3ModalAccount()

    // Gen data
    const [txStatus, setTxStatus] = useState<TransactionStatus>("NONE")
    const [txMsg, setTxMsg] = useState<string>(generateTxStatusMessages["NONE"])
    // const isPreGenerationState = ["NONE", "CONFIRM_TX", "TX_REJECTED"].includes()
    const [progress, setProgress] = useState<number>(0)
    const [rolledNFT, setRolledNFT] = useState<NFTExt>()

    const shouldDisplayProgressBar = progress !== 0

    const handleGenerate = async () => {
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

        // TODO: Better err handling. Add some kind of pop-up
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
                ...nftData
            }

            const nftRes: NFTExt = {
                rarityLevel: rLevel,
                rarityData: rData,
                ...nftBase
            }

            console.log('[DEBUG] - drop: ', JSON.stringify(nftRes, null, 4))

            // DEBUG
            // console.log("raw val ", nft.attributes[0].value)
            // console.log("conv bp -> perc ", formatBpToPercentage(nft.attributes[0].value))
            // console.log("rarity ", getRarityFromPerc(formatBpToPercentage(nft.attributes[0].value), rGroups))


            // console.log("rarityLevel from conv:  ", rarityLevel)

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

    useEffect(() => {
        progressListener()
    }, [])

    // (MOCK LOGIC FOR TESTING) ======================
    // const mockHandleGenerate = () => {
    //     const TICK_TIMEOUT_MS = 500

    //     setTxStatus("AWAIT_CONFIRM")

    //     setTimeout(() => {
    //         setProgress(20)
    //         setTxStatus("BEFORE_MINT")
    //     }, TICK_TIMEOUT_MS)

    //     setTimeout(() => {
    //         setProgress(45)
    //         setTxStatus("MINTED")
    //     }, TICK_TIMEOUT_MS * 2)

    //     setTimeout(() => {
    //         setProgress(75)
    //         setTxStatus("FINISHING")
    //     }, TICK_TIMEOUT_MS * 3)

    //     setTimeout(() => {
    //         const mockRarityLevel = getRarityFromLevel(fallbackNFTRarityLevel, rGroups)
    //         const mockRolled: NFTExt = {
    //             rarityLevel: fallbackNFTRarityLevel,
    //             rarityData: mockRarityLevel,
    //             ...fallbackNFT,
    //         }
    //         setProgress(100)
    //         setTxStatus("DONE")
    //         setRolledNFT(mockRolled)
    //     }, TICK_TIMEOUT_MS * 4)
    // }

    useEffect(() => {
        setTxMsg(generateTxStatusMessages[txStatus])
    }, [txStatus])

    return (
        <FullscreenContainer>
            <Navbar />

            <ContentContainer additionalClasses="flex-col gap-4">
                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center">
                    <PageTitle title="NFT Generator" />

                    <GenerateContainer rolledNFT={rolledNFT} runBorderAnim={!rolledNFT} rGroups={rGroups} />

                    {/* Status text */}
                    <div className={cl("flex w-fit h-fit p-3 rounded-xl text-lg", "border border-light-border dark:border-dark-border")}>
                        {rolledNFT ? (
                            <p>
                                Congratulations! You rolled a&nbsp;
                                <span
                                    style={{
                                        color: rolledNFT.rarityData.color,
                                        borderBottomWidth: 1,
                                        borderBottomColor: rolledNFT.rarityData.color,
                                    }}
                                    className="font-bold"
                                >
                                    {rolledNFT.rarityLevel}
                                </span>
                                &nbsp;NFT!!!
                            </p>
                        ) : isConnected ? (
                            <p>{txMsg}</p>
                        ) : (
                            <p>Connect your wallet first</p>
                        )}
                    </div>

                    {/* Progress bar */}
                    {shouldDisplayProgressBar && (
                        <div className={`w-1/2 h-3 rounded-xl border border-light-border dark:border-dark-border`}>
                            <div
                                style={{ width: `${progress}%` }}
                                className={cl(
                                    "flex h-full rounded-xl",
                                    "bg-gradient-to-r from-accentDark via-accent to-accentDark",
                                    "transition-all duration-300",
                                )}
                            />
                        </div>
                    )}

                    {isConnected && txStatus === "NONE" && (
                        <Button
                            text={"Generate!"}
                            disabled={!isConnected || txStatus !== "NONE"}
                            onClick={() => handleGenerate()}
                        // onClick={() => mockHandleGenerate()} // MOCK FOR TESTING
                        />
                    )}
                </div>

                <SectionTitle additionalClasses="max-sm:justify-center max-sm:items-center" title={"Keywords"} />

                <div className="sm:inline-grid md:grid-cols-5 max-sm:flex-col max-md:grid-cols-2 max-sm:flex gap-4 w-auto font-bold mx-auto">
                    {Object.entries(rGroups).map(([, rGroup], i) => (
                        <div key={i} className="flex flex-col gap-3 w-full h-full items-center">
                            <div className="flex flex-col w-fit h-fit gap-3">
                                <p
                                    className="text-lg w-fit font-thin font-content"
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: rGroup.color,
                                    }}
                                >
                                    {rGroup.name}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {rGroup.keywords.slice(0, 6).map((keyword, idx, arr) => {
                                        const isLastItem = idx === arr.length - 1
                                        return (
                                            <span
                                                key={idx}
                                                className={cl(
                                                    "flex justify-center items-center w-fit p-2",
                                                    "font-thin font-content",
                                                    "rounded-xl bg-light-bgPrimary/25 dark:bg-dark-bgPrimary/25",
                                                )}
                                                style={{
                                                    borderWidth: 1,
                                                    borderRadius: 6,
                                                    borderColor: rGroup.color,
                                                }}
                                            >
                                                {isLastItem ? "..." : keyword.name}
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    className={cl(
                        "flex w-full h-fit justify-end items-center p-3 mt-3",
                        "rounded-xl border border-light-border dark:border-dark-border",
                    )}
                >
                    <Button text="See all Keywords" onClick={() => navigate(routerPaths.home)} />
                </div>
            </ContentContainer>
        </FullscreenContainer>
    )
}

export default Generate
