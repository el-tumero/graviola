import { useState, useEffect, useContext } from "react"
import GenerateContainer from "../components/GenerateContainer"
import Navbar from "../components/Navbar"
import Button from "../components/ui/Button"
import ContentContainer from "../components/ui/ContentContainer"
import FullscreenContainer from "../components/ui/FullscreenContainer"
import HorizontalLine from "../components/ui/HorizontalLine"
import { GraviolaContext } from "../contexts/GraviolaContext"

interface Keyword {
    name: string
    lowerRange: number
    upperRange: number
}

const Generate = () => {

    const [keywordsLoaded, setKeywordsLoaded] = useState<boolean>(false)
    const [keywords, setKeywords] = useState<Array<Keyword>>([])

    const [wConnected, setWConnected] = useState<boolean>(false)
    const [isGenerating, setIsGenerating] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)
    


    // TODO: Fetch keywords from contract on page load
    const graviolaContext = useContext(GraviolaContext)
    
    useEffect(() => {
        // graviolaContext.contract?.getAllWords().then(words => { console.log(words) /*setKeywords(words.map(word => {name: word[0], lowerRange: 0, upperRange: 1}))*/ })
        graviolaContext.contract?.getAllWords().then((words) => {
            const data = words.map(word => ({name: word.keyword, lowerRange: Number(word.lowerRange), upperRange: Number(word.upperRange)}))
            setKeywords(data)
        })
        setKeywordsLoaded(true)

    }, [graviolaContext.contract])
    
    const simulateGenerating = () => {
        if (progress >= 90) return
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                setProgress(progress => progress + 10)
            }, i * 1000)
        }
    }

    return (
        <FullscreenContainer>
            <Navbar />

            <ContentContainer additionalClasses="flex-col gap-4">


                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center my-28">

                    <Button text="Simulate connect/disconnect wallet" onClick={() => setWConnected(!wConnected)} enabled={!wConnected} />
                    <p>mock wallet connected?: {wConnected.toString()}</p>
                    <br />
                    <h1 className='font-bold text-2xl'>NFT Generator</h1>
                    <GenerateContainer isPulsating={!wConnected} isGenerating={isGenerating} />
                    <div className={`w-1/2 h-5 rounded-xl border-2 border-light-border dark:border-dark-border`}>
                        <div style={{ width: `${progress}%`}} className="flex h-full bg-accent rounded-xl transition-all duration-150"></div>
                    </div>
                    {isGenerating && <p>State: .....</p>}
                    <Button text="Generate" enabled={wConnected && !isGenerating} onClick={() => {
                        setIsGenerating(true)
                        simulateGenerating()
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





