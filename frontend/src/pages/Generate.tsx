import { useState, useEffect, useContext } from "react"
import GenerateContainer from "../components/GenerateContainer"
import Navbar from "../components/Navbar"
import Button from "../components/ui/Button"
import ContentContainer from "../components/ui/ContentContainer"
import FullscreenContainer from "../components/ui/FullscreenContainer"
import { NFT } from "../types/NFT"
import { Keyword } from "../types/Keyword"
import { GraviolaContext } from "../contexts/GraviolaContext"
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react'
import { getRarityFromThreshold, formatBpToPercentage } from "../utils/getRarityDataFromThreshold"
import { nftCreationStatusMessages } from "../types/NFTCreationStatus"
import SectionTitle from "../components/ui/SectionTitle"
import { NFTCreationStatus } from "../types/NFTCreationStatus"
import { getRarityColor } from "../utils/getRarityBorder"
import RarityBubble from "../components/ui/RarityBubble"
import { Graviola } from "../../../contracts/typechain-types/contracts/Graviola"
import { RarityData, RarityLevel } from "../types/Rarity"

// Extended NFT interface to avoid computing the same properties multiple times
interface NFTExt extends NFT {
    rarityLevel: RarityLevel
    rarityData: RarityData
}

const Generate = () => {

    const { walletProvider } = useWeb3ModalProvider()
    const graviolaContext = useContext(GraviolaContext)
    const contractKeywords = graviolaContext.keywords as Keyword[]

    const { isConnected } = useWeb3ModalAccount()

    const [progressState, setProgressState] = useState<NFTCreationStatus>("NONE")
    const isPreGenerationState = ["NONE", "CONFIRM_TX", "TX_REJECTED"].includes(progressState)
    const [progressMessage, setProgressMessage] = useState<string>(nftCreationStatusMessages["NONE"])
    const [progressBarVal, setProgressBarVal] = useState<number>(0)

    const [rolledNFT, setRolledNFT] = useState<NFTExt>()

    // Generation state listener
    const progressListener = () => {
        if (!walletProvider) return
        const graviola = graviolaContext.contract as Graviola

        const onMint = (addr: string, tokenId: bigint) => {
            console.log(`[info] onMint: addr ${addr}, tokenId ${tokenId}`)
            setProgressState("MINTED")
            setProgressBarVal(50)
        }

        const onPromptRequest = (smth: string) => {
            console.log(`[info] onPromptRequest done: ${smth}`)
            setProgressState("WAIT_IMAGE")
            setProgressBarVal(75)
        }

        const onTokenReady = async (addr: string, tokenId: bigint) => {

            console.log(`[info] onTokenReady: addr ${addr}, tokenId ${tokenId}`)

            // TODO: CHECK ADDRESS OF ROLLER
            const uri = await graviola.tokenURI(tokenId)
            const response = await fetch(uri)
            const nft: NFT = await response.json()
            const [rarityLevel, rarityData] = getRarityFromThreshold(nft.attributes[0].value)

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
        graviola.on(graviola.filters.PromptRequest, onPromptRequest)
        graviola.on(graviola.filters.TokenReady, onTokenReady)

        return () => {
            graviola.off(graviola.filters.Mint, onMint)
            graviola.off(graviola.filters.PromptRequest, onPromptRequest)
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

                    <h1 className='font-bold text-2xl'>NFT Generator</h1>

                    {/* Img container */}
                    <GenerateContainer rolledNFT={rolledNFT} isPulsating={!isConnected} isGenerating={!isPreGenerationState} />

                    {/* Progress bar */}
                    {(progressBarVal !== 0) &&
                        <div className={`w-1/2 h-5 rounded-xl border-2 border-light-border dark:border-dark-border shadow-inner`}>
                            <div style={{ width: `${progressBarVal}%` }} className="flex h-full bg-accent rounded-xl transition-all duration-150"></div>
                        </div>
                    }

                    {/* State/Progress text */}
                    {progressState === "DONE"
                        ?
                        <NftResultText rarityLevel={rolledNFT!.rarityLevel} rarityName={rolledNFT!.rarityData.name} />
                        :
                        <span className="text-lg font-bold">{progressMessage}</span>
                    }

                    {(progressState === "NONE") && <Button text={isConnected ? "Generate!" : "Connect your wallet first"} enabled={isConnected && (progressState === "NONE")} onClick={async () => {
                        setProgressState("CONFIRM_TX")
                        const estFee = await graviolaContext.contract?.estimateFee() as bigint
                        try {
                            await graviolaContext.contract?.mint({
                                value: estFee + 12000n
                            })
                            setProgressState("BEFORE_MINT")
                            setProgressBarVal(25)
                        } catch (err) {
                            setProgressState("TX_REJECTED")
                            setTimeout(() => setProgressState("NONE"), 5000)
                            return
                        }
                    }} />}

                </div>

                <SectionTitle
                    mainText={{
                        content: "Keyword list"
                    }}
                />
                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center p-4">
                    <div className="sm:grid md:grid-cols-4 max-sm:flex-col max-md:grid-cols-2 max-sm:flex gap-4 w-full font-bold">
                        {contractKeywords.map((keyword: Keyword, i) => (
                            <div
                                key={i}
                                className={`
                                    flex flex-col justify-center items-center
                                    gap-1 bg-light-bgLight/50 dark:bg-dark-bgLight/50
                                    border-2 border-light-border dark:border-dark-border
                                    p-4 rounded-xl
                                `}>
                                <div className="flex gap-1 justify-center items-center">
                                    <RarityBubble rarity={getRarityFromThreshold(formatBpToPercentage(keyword.rarityPerc))[0]} additionalClasses="self-center" />
                                    <span>{keyword.name}</span>
                                </div>
                                <p className="text-xs opacity-50">{formatBpToPercentage(keyword.rarityPerc).toFixed(4) + "%"}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </ContentContainer>


        </FullscreenContainer>

    )
}

const NftResultText = (props: { rarityLevel: RarityLevel, rarityName: string }) => {
    return (
        <p className="text-lg font-bold">{`Congratulations! You rolled a `}
            <span style={{ color: getRarityColor(props.rarityLevel) }} className="font-bold underline">{(props.rarityName).toUpperCase()}!!!</span>
        </p>
    )
}

export default Generate





