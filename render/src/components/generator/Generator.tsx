import CardGenerate from "../card/generator/CardGenerate"
import GeneratorButton from "./GeneratorButton"
import { useState } from "react"
import { generationPhase, type GenerationPhase } from "./generator"

interface Props {}

const Generator: React.FC<Props> = () => {
    const [phase, setPhase] = useState<GenerationPhase>("NONE")
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [keywords, setKeywords] = useState<string[]>([])

    const addKeywords = async () => {
        setKeywords((keywords) => [...keywords, "keyword1"])
        await new Promise((r) => setTimeout(r, 1000))
        setKeywords((keywords) => [...keywords, "keyword2"])
        await new Promise((r) => setTimeout(r, 1000))
        setKeywords((keywords) => [...keywords, "keyword3"])
    }

    const nextPhase = () => {
        setPhase(generationPhase[phaseIndex])
        if (generationPhase[phaseIndex] === "GENERATE_KEYWORDS") {
            addKeywords()
        }
        setPhaseIndex((phaseIndex + 1) % generationPhase.length)
    }

    return (
        <>
            <div className="flex justify-center my-8">
                <CardGenerate keywords={keywords} />
            </div>
            <div className="flex justify-center">
                <GeneratorButton phase={phase} nextPhase={nextPhase} />
            </div>
            {/* <p className="animate-fadeIn">Test</p> */}
        </>
    )
}

export default Generator
