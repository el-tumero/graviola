import { useState, useEffect, useContext } from "react"
import GenerateContainer from "../components/GenerateContainer"
import Navbar from "../components/Navbar"
import Button from "../components/ui/Button"
import ContentContainer from "../components/ui/ContentContainer"
import FullscreenContainer from "../components/ui/FullscreenContainer"
import HorizontalLine from "../components/ui/HorizontalLine"
import { GraviolaContext } from "../contexts/GraviolaContext"
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react"
import { GRAVIOLA_CONTRACT_ADDRESS } from "../App"
import { ethers } from "ethers"

interface Keyword {
    name: string
    lowerRange: number
    upperRange: number
}


const abi = [
    "event RequestSent(uint256 requestId)",
    "event Transfer(address from, address to, uint tokenId)"
]

type ProgressState = "NONE" | "BEFORE_MINT" | "MINTED" | "WAIT_IMAGE" | "DONE" 

const Generate = () => {
    const graviolaContext = useContext(GraviolaContext)
    const { isConnected } = useWeb3ModalAccount()

    const [keywordsLoaded, setKeywordsLoaded] = useState<boolean>(false)
    const [keywords, setKeywords] = useState<Array<Keyword>>([])

    const { walletProvider } = useWeb3ModalProvider()


    const [nftImg, setNftImg] = useState<string>()
    const [progressState, setProgressState] = useState<ProgressState>("NONE")
    
    const progressListener = () => {

        const address = GRAVIOLA_CONTRACT_ADDRESS
        if(!walletProvider) return
        const provider = new ethers.providers.Web3Provider(walletProvider)
        const graviolaEvents = new ethers.Contract(address, abi, provider.getSigner())
        graviolaEvents.on("RequestSent", (requestId, event) => {
            console.log(event)
        })

    }

    useEffect(() => {
        console.log("init progressChange listener")
        // window.addEventListener("progressChange", progressListener)
        progressListener()
        // return window.removeEventListener("progressChange", progressListener)
    }, [])
            
    useEffect(() => {
        graviolaContext.contract?.getAllWords().then((words) => {
            const data = words.map(word => ({name: word.keyword, lowerRange: Number(word.lowerRange), upperRange: Number(word.upperRange)}))
            setKeywords(data)
        })
        setKeywordsLoaded(true)

    })

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

                <HorizontalLine />
                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center mt-28 p-4">
                    {keywordsLoaded &&
                    <>
                        <h2 className='font-bold text-xl mb-4'>Keyword list</h2>
                        <div className="md:grid md:grid-cols-4 max-md:flex-col max-md:flex gap-4 w-full font-bold">
                            {keywords.map((keyword, index) => (
                                <div key={index} className="bg-light-bgLight dark:bg-dark-bgLight border-2 border-light-border dark:border-dark-border p-4 rounded-xl text-center">
                                    {keyword.name}
                                </div>
                            ))}
                        </div>
                    </>}
                </div>

            </ContentContainer>


        </FullscreenContainer>

    )
}

export default Generate





