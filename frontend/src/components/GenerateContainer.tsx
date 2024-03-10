import { useEffect, useState } from "react"
import useRandomRarityBorder from "../hooks/useBorderAnimation"

interface GenerateContainerProps {
    imgSrc?: string
    isPulsating: boolean
    isGenerating: boolean
}

const GenerateContainer = ({ imgSrc, isPulsating, isGenerating }: GenerateContainerProps) => {
    const rarityAnimBorder = useRandomRarityBorder(isGenerating, 750)
    const [resOpacity, setResOpacity] = useState<number>(0)

    useEffect(() => {
        if (imgSrc) {
            setResOpacity(0)
            setTimeout(() => setResOpacity(1), 100)
        }
    }, [imgSrc])

    return (
        // TODO: Change this empty style{} to a passed as prop resultRarity
        // TODO2: Add pulsating border of rolled rarity color on finish
        <div style={isGenerating ? rarityAnimBorder : {}} className={`flex justify-center items-center w-64 h-64 p-4 m-8 rounded-xl bg-light-bgDark dark:bg-dark-bgDark border-2 border-light-border dark:border-dark-border ${isPulsating ? "animate-pulse" : ""}`}>
            {imgSrc &&
                <>
                    <img
                        className={`w-full h-full rounded-lg`}
                        style={{ opacity: resOpacity, transition: 'opacity 0.6s' }}
                        src={imgSrc} />
                </>
            }
        </div>
    )
}

export default GenerateContainer