import { useState, useEffect, useContext } from "react"
import GenerateContainer from "../components/GenerateContainer"
import Navbar from "../components/Navbar"
import Button from "../components/ui/Button"
import ContentContainer from "../components/ui/ContentContainer"
import FullscreenContainer from "../components/ui/FullscreenContainer"
import { NFT } from "../types/NFT"
import { Keyword } from "../types/Keyword"
import { GraviolaContext } from "../contexts/GraviolaContext"
import { createWeb3Modal, defaultConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react'
import { getRarityFromThreshold } from "../utils/getRarityDataFromThreshold"
import { nftCreationStatusMessages } from "../types/NFTCreationStatus"
import SectionTitle from "../components/ui/SectionTitle"
import { NFTCreationStatus } from "../types/NFTCreationStatus"
import { convertToIfpsURL } from "../utils/convertToIpfsURL"
import { getRarityColor } from "../utils/getRarityBorder"
import RarityBubble from "../components/ui/RarityBubble"
import { Graviola } from "../../../contracts/typechain-types/contracts/Graviola"
import { ethers } from "ethers"

const NftResultText = (props: { imgRarityPerc: number }) => {
    const [rarityLevel, rarityData] = getRarityFromThreshold(props.imgRarityPerc)
    return (
        <p>{`Congratulations! You rolled a `}
            <span style={{ color: getRarityColor(rarityLevel) }} className="font-bold underline">{(rarityData.name).toUpperCase()}!!!</span>
        </p>
    )
}

const Generate = () => {

    const { walletProvider } = useWeb3ModalProvider()
    const graviolaContext = useContext(GraviolaContext)
    const contractNFTs = graviolaContext.collection as NFT[]
    const contractKeywords = graviolaContext.keywords as Keyword[]

    const { isConnected } = useWeb3ModalAccount()

    const [nftImg, setNftImg] = useState<string>() // mock img 
    const [nftImgR, setNftImgR] = useState<number>(0) // mock rar

    // export type NFTCreationStatus = "NONE" | "BEFORE_MINT" | "MINTED" | "WAIT_IMAGE" | "DONE"
    const [progressState, setProgressState] = useState<NFTCreationStatus>("NONE")
    const [progressMessage, setProgressMessage] = useState<string>(nftCreationStatusMessages["NONE"])
    const [progressBarVal, setProgressBarVal] = useState<number>(0)

    // Generation state listener
    const progressListener = () => {
        if(!walletProvider) return
        const graviola = graviolaContext.contract as Graviola

        const onRequestSent = (requestId: number) => {
            console.log(`reqId: ${requestId}`)
        }

        const onTransfer = (from: string, to: string, tokenId: number) => {
            console.log(`from: ${from}, to: ${to}, tokenid: ${tokenId}`)
        }

        const onPromptResponse = (input: number, output: number) => {
            console.log("promptResponse: ", input, output)
        }

        const onTokenReady = (tokenId: number) => {
            console.log("token ready! id: ", tokenId)
        }

        graviola.on("PromptRequest", onRequestSent);
        graviola.on("Transfer", onTransfer);
        graviola.on("PromptResponse", onPromptResponse);
        graviola.on("TokenReady", onTokenReady);

        return () => {
            graviola.off("PromptRequest", onRequestSent);
            graviola.off("Transfer", onTransfer);
            graviola.off("PromptResponse", onPromptResponse);
            graviola.off("TokenReady", onTokenReady);
        };

    }

    useEffect(() => {
        progressListener()
    }, [])

    return (
        <FullscreenContainer>
            <Navbar />

            <ContentContainer additionalClasses="flex-col gap-4">

                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center my-28">

                    <h1 className='font-bold text-2xl'>NFT Generator</h1>

                    {/* Img container */}
                    <GenerateContainer resImg={nftImg} resRarity={getRarityFromThreshold(nftImgR)[0]} isPulsating={!isConnected} isGenerating={(progressState !== "NONE" && progressState !== "DONE")} />

                    {/* Progress bar */}
                    {(progressBarVal !== 0) &&
                        <div className={`w-1/2 h-5 rounded-xl border-2 border-light-border dark:border-dark-border shadow-inner`}>
                            <div style={{ width: `${progressBarVal}%`}} className="flex h-full bg-accent rounded-xl transition-all duration-150"></div>
                        </div>
                    }

                    {/* State/Progress text */}
                    {progressState === "DONE"
                        ?
                            <NftResultText imgRarityPerc={nftImgR} />
                        :
                            <span>{progressMessage}</span>
                    }

                    {(progressState === "NONE") && <Button text={isConnected ? "Generate!" : "Connect your wallet first"} enabled={isConnected && (progressState === "NONE")} onClick={async () => {
                        const estFee = await graviolaContext.contract?.estimateFee() as bigint
                        graviolaContext.contract?.mint({
                            value: estFee + 12000n
                        })
                    }} />}

                </div>

                <SectionTitle
                    mainText={{
                        content: "Keyword list"
                    }}
                />
                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center p-4">
                    <div className="md:grid md:grid-cols-4 max-md:flex-col max-md:flex gap-4 w-full font-bold">
                        {contractKeywords.map((keyword: Keyword, i) => (
                            <div key={i} className="flex justify-center items-center gap-1 bg-light-bgLight/50 dark:bg-dark-bgLight/50 border-2 border-light-border dark:border-dark-border p-4 rounded-xl">
                                <RarityBubble rarity={getRarityFromThreshold(keyword.rarityPerc)[0]} />
                                <span>{keyword.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </ContentContainer>


        </FullscreenContainer>

    )
}

export default Generate





