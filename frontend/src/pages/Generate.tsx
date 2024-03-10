import { useState, useEffect, useContext } from "react"
import GenerateContainer from "../components/GenerateContainer"
import Navbar from "../components/Navbar"
import Button from "../components/ui/Button"
import ContentContainer from "../components/ui/ContentContainer"
import FullscreenContainer from "../components/ui/FullscreenContainer"
import { NFT } from "../types/NFT"
import { Keyword } from "../types/Keyword"
import { GraviolaContext } from "../contexts/GraviolaContext"
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react"
import { GRAVIOLA_CONTRACT_ADDRESS } from "../App"
import { ethers } from "ethers"
import SectionTitle from "../components/ui/SectionTitle"
import { NFTCreationStatus } from "../types/NFTCreationStatus"

const abi = [
    "event RequestSent(uint256 requestId)",
    "event Transfer(address from, address to, uint tokenId)",
    "event PromptResponse(string input, string output)",
    "event TokenReady(uint256 tokenId)"
]


const Generate = () => {
    
    const { walletProvider } = useWeb3ModalProvider()
    const graviolaContext = useContext(GraviolaContext)
    const contractNFTs = graviolaContext.collection as NFT[]
    const contractKeywords = graviolaContext.keywords as Keyword[]

    const { isConnected } = useWeb3ModalAccount()

    const [nftImg, setNftImg] = useState<string>()
    const [progressState, setProgressState] = useState<NFTCreationStatus>("NONE")

    const simulateGenerationProcess = async () => {

    }

    
    // NOTE: Current listener is leaking somewhere, causes high CPU usage(!)
    // const progressListener = () => {

    //     const address = GRAVIOLA_CONTRACT_ADDRESS
    //     if(!walletProvider) return
    //     const provider = new ethers.providers.Web3Provider(walletProvider)
    //     const graviolaEvents = new ethers.Contract(address, abi, provider.getSigner())
    //     console.log(graviolaEvents)

    //     graviolaEvents.on("RequestSent", (requestId) => {
    //         console.log(`reqId: ${requestId}`)
    //     })

    //     graviolaEvents.on("Transfer", (from, to, tokenId) => {
    //         console.log(`from: ${from}, to: ${to}, tokenid: ${tokenId}`)
    //     })

    //     graviolaEvents.on("PromptResponse", (input, output) => {
    //         console.log("promptResponse: ", input, output)
    //     })

    //     graviolaEvents.on("TokenReady", (tokenId) => {
    //         console.log("token ready! id: ", tokenId)
    //     })

    // }

    // useEffect(() => {
    //     console.log("init progressChange listener")
    //     // window.addEventListener("progressChange", progressListener)
    //     progressListener()
    //     // return window.removeEventListener("progressChange", progressListener)
    // }, [walletProvider])

    return (
        <FullscreenContainer>
            <Navbar />

            <ContentContainer additionalClasses="flex-col gap-4">


                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center my-28">
                    <h1 className='font-bold text-2xl'>NFT Generator</h1>
                    <GenerateContainer isPulsating={!isConnected} isGenerating={(progressState !== "NONE")} />
                    <div className={`w-1/2 h-5 rounded-xl border-2 border-light-border dark:border-dark-border`}>
                        <div style={{ width: `0%`}} className="flex h-full bg-accent rounded-xl transition-all duration-150"></div>
                    </div>
                    <p>State: {progressState.toString()}</p>
                    <Button text={isConnected ? "Generate!" : "Connect your wallet first"} enabled={isConnected && (progressState === "NONE")} onClick={() => {
                        graviolaContext.contract?.requestMint()
                    }} />
                </div>

                <SectionTitle
                    mainText={{
                        content: "Keyword list"
                    }}
                />
                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center p-4">
                    <div className="md:grid md:grid-cols-4 max-md:flex-col max-md:flex gap-4 w-full font-bold">
                        {contractKeywords.map((keyword: Keyword, i) => (
                            <div key={i} className="bg-light-bgLight/50 dark:bg-dark-bgLight/50 border-2 border-light-border dark:border-dark-border p-4 rounded-xl text-center">
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





