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
import { formatBpToPercentage } from "../utils/format"
import { generateTxStatusMessages } from "../utils/statusMessages"
import SectionTitle from "../components/ui/layout/SectionTitle"
import { TransactionStatus } from "../types/TransactionStatus"
import { parseEther } from "ethers"
import { Graviola } from "../../../contracts/typechain-types/Graviola"
import { RarityGroupData, RarityLevel } from "../types/Rarity"
import ResultText from "../components/ui/ResultText"
import { RaritiesData } from "../types/RarityGroup"
import router, { routerPaths } from "../router"
import { useNavigate } from "react-router-dom"
import PageTitle from "../components/ui/layout/PageTitle"

// Extended NFT interface to avoid computing the same properties multiple times
export interface NFTExt extends NFT {
    rarityLevel: RarityLevel
    rarityData: RarityGroupData
}

const Generate = () => {
    const navigate = useNavigate()
    const { walletProvider } = useWeb3ModalProvider()
    const graviolaContext = useContext(GraviolaContext)
    const rGroups = graviolaContext.rarities as RaritiesData

    const { isConnected, address } = useWeb3ModalAccount()

    const [progressState, setProgressState] = useState<TransactionStatus>(isConnected ? "NONE" : "WALLET_NOT_CONNECTED")
    const isPreGenerationState = ["NONE", "CONFIRM_TX", "TX_REJECTED"].includes(progressState)
    const [progressMessage, setProgressMessage] = useState<string>(generateTxStatusMessages["NONE"])
    const [progressBarVal, setProgressBarVal] = useState<number>(0)

    const [rolledNFT, setRolledNFT] = useState<NFTExt>()

    // Generation state listener
    const progressListener = () => {
        if (!walletProvider) return
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

            // DEBUG
            // console.log("raw val ", nft.attributes[0].value)
            // console.log("conv bp -> perc ", formatBpToPercentage(nft.attributes[0].value))
            // console.log("rarity ", getRarityFromPerc(formatBpToPercentage(nft.attributes[0].value), rGroups))

            const [rarityLevel, rarityData] = getRarityFromPerc(formatBpToPercentage(nft.attributes[0].value))

            // console.log("rarityLevel from conv:  ", rarityLevel)

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

    useEffect(() => {
        progressListener()
    }, [])

    useEffect(() => {
        if (!isConnected) setProgressState("WALLET_NOT_CONNECTED")
    }, [isConnected])

    useEffect(() => {
        setProgressMessage(generateTxStatusMessages[progressState])
    }, [progressState])

    return (
        <FullscreenContainer>
            <Navbar />

            <ContentContainer additionalClasses="flex-col gap-4">
                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center">
                    <PageTitle title="NFT Generator" additionalClasses="" />

                    <GenerateContainer
                        rolledNFT={rolledNFT}
                        isPulsating={!isConnected}
                        isGenerating={!isPreGenerationState}
                        rGroups={rGroups}
                    />

                    {/* Progress bar */}
                    {/* {progressBarVal !== 0 && (
                        <div className={`w-1/2 h-5 rounded-xl border-2 border-light-border dark:border-dark-border shadow-inner`}>
                            <div
                                style={{
                                    width: `${progressBarVal}%`,
                                }}
                                className="flex h-full bg-accent rounded-xl transition-all duration-150"
                            ></div>
                        </div>
                    )} */}

                    <div className={cl("flex w-fit h-fit p-3 rounded-xl", "border border-light-border dark:border-dark-border", "text-lg")}>
                        {progressMessage}
                    </div>

                    {progressState === "NONE" && (
                        <Button
                            text={isConnected ? "Generate!" : "Connect your wallet first"}
                            disabled={!isConnected || progressState !== "NONE"}
                            onClick={async () => {
                                setProgressState("CONFIRM_TX")
                                const estFee = (await graviolaContext.contract?.estimateFee()) as bigint
                                try {
                                    const tx = await graviolaContext.contract?.mint({
                                        value: estFee + parseEther("0.01"),
                                    })
                                    const receipt = await tx?.wait()
                                    if (receipt) {
                                        console.log("OK")
                                        setProgressState("BEFORE_MINT")
                                        setProgressBarVal(25)
                                    }
                                } catch (err) {
                                    setProgressState("TX_REJECTED")
                                    setTimeout(() => setProgressState("NONE"), 3000)
                                    return
                                }
                            }}
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
