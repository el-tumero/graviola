import { useState, useEffect, useContext } from "react"
import GenerateContainer from "../components/GenerateContainer"
import Navbar from "../components/Navbar"
import Button from "../components/ui/Button"
import ContentContainer from "../components/ui/ContentContainer"
import FullscreenContainer from "../components/ui/FullscreenContainer"
import { NFT } from "../types/NFT"
import { GraviolaContext } from "../contexts/GraviolaContext"
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"
import {
    getRarityFromPerc,
    formatBpToPercentage,
} from "../utils/getRarityDataFromThreshold"
import { nftCreationStatusMessages } from "../types/NFTCreationStatus"
import SectionTitle from "../components/ui/SectionTitle"
import { NFTCreationStatus } from "../types/NFTCreationStatus"
import { parseEther } from "ethers"
import { Graviola } from "../../../contracts/typechain-types/contracts/Graviola"
import { RarityGroupData, RarityLevel } from "../types/Rarity"
import ResultText from "../components/ui/ResultText"
import { RaritiesData } from "../types/RarityGroup"

// Extended NFT interface to avoid computing the same properties multiple times
export interface NFTExt extends NFT {
    rarityLevel: RarityLevel
    rarityData: RarityGroupData
}

const Generate = () => {
    const { walletProvider } = useWeb3ModalProvider()
    const graviolaContext = useContext(GraviolaContext)
    const rGroups = graviolaContext.rarities as RaritiesData

    const { isConnected, address } = useWeb3ModalAccount()

    const [progressState, setProgressState] =
        useState<NFTCreationStatus>("NONE")
    const isPreGenerationState = ["NONE", "CONFIRM_TX", "TX_REJECTED"].includes(
        progressState,
    )
    const [progressMessage, setProgressMessage] = useState<string>(
        nftCreationStatusMessages["NONE"],
    )
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

            const [rarityLevel, rarityData] = getRarityFromPerc(
                formatBpToPercentage(nft.attributes[0].value),
                rGroups,
            )

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
        setProgressMessage(nftCreationStatusMessages[progressState])
    }, [progressState])

    return (
        <FullscreenContainer>
            <Navbar />

            <ContentContainer additionalClasses="flex-col gap-4">
                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center my-28">
                    <h1 className="font-bold text-2xl">NFT Generator</h1>

                    {/* Img container */}
                    <GenerateContainer
                        rolledNFT={rolledNFT}
                        isPulsating={!isConnected}
                        isGenerating={!isPreGenerationState}
                        rGroups={rGroups}
                    />

                    {/* Progress bar */}
                    {progressBarVal !== 0 && (
                        <div
                            className={`w-1/2 h-5 rounded-xl border-2 border-light-border dark:border-dark-border shadow-inner`}
                        >
                            <div
                                style={{
                                    width: `${progressBarVal}%`,
                                }}
                                className="flex h-full bg-accent rounded-xl transition-all duration-150"
                            ></div>
                        </div>
                    )}

                    {/* State/Progress text */}
                    {progressState === "DONE" ? (
                        <ResultText rGroup={rolledNFT!.rarityData} />
                    ) : (
                        <span className="text-lg font-bold">
                            {progressMessage}
                        </span>
                    )}

                    {progressState === "NONE" && (
                        <Button
                            text={
                                isConnected
                                    ? "Generate!"
                                    : "Connect your wallet first"
                            }
                            enabled={isConnected && progressState === "NONE"}
                            onClick={async () => {
                                setProgressState("CONFIRM_TX")
                                const estFee =
                                    (await graviolaContext.contract?.estimateFee()) as bigint
                                try {
                                    const tx =
                                        await graviolaContext.contract?.mint({
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
                                    setTimeout(
                                        () => setProgressState("NONE"),
                                        3000,
                                    )
                                    return
                                }
                            }}
                        />
                    )}
                </div>

                <SectionTitle
                    mainText={{
                        content: "Keywords",
                    }}
                />
                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center p-4">
                    {Object.entries(rGroups).map(([, rGroup], i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-4 w-full h-full"
                        >
                            <div className="flex flex-col gap-2 mb-6">
                                <p className="font-bold text-xl mb-2">
                                    {rGroup.name}
                                </p>
                                <div className="sm:grid md:grid-cols-4 max-sm:flex-col max-md:grid-cols-2 max-sm:flex gap-4 w-full font-bold">
                                    {rGroup.keywords.map(
                                        (keyword, keywordIndex) => (
                                            <span
                                                key={keywordIndex}
                                                className="flex justify-center items-center py-2 px-3 rounded-md bg-light-bgLight/75 dark:bg-dark-bgLight/75"
                                                style={{
                                                    borderWidth: 2,
                                                    borderRadius: 8,
                                                    borderColor: rGroup.color,
                                                }}
                                            >
                                                {keyword.name}
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ContentContainer>
        </FullscreenContainer>
    )
}

export default Generate
