import { useEffect, useState } from "react"
import useRandomRarityBorder from "../hooks/useBorderAnimation"
import { getRarityBorder } from "../utils/getRarityBorder"
import { RarityLevel } from "../types/Rarity"

interface GenerateContainerProps {
    resImg?: string // Passed only when already rolled
    resRarity?: RarityLevel // Same here
    isPulsating: boolean
    isGenerating: boolean
}

const GenerateContainer = ({ resImg, resRarity, isPulsating, isGenerating }: GenerateContainerProps) => {

    const rarityAnimBorder = useRandomRarityBorder(isGenerating, 750)
    const [resOpacity, setResOpacity] = useState<number>(0)
    const resReady = (resImg && resRarity)
    const { style: breathingBorderStyle = {}, className: breathingBorderClassNames = "" } = resReady ? getRarityBorder(resRarity, true) : {};

    useEffect(() => {
        if (resImg) {
            setResOpacity(0)
            setTimeout(() => setResOpacity(1), 100)
        }
    }, [resImg])

    return (
        // TODO: Change this empty style{} to a passed as prop resultRarity
        <div style={resReady ? breathingBorderStyle :isGenerating ? rarityAnimBorder : {}} className={`flex justify-center items-center w-64 h-64 p-4 m-8 rounded-xl bg-light-bgDark dark:bg-dark-bgDark border-2 border-light-border dark:border-dark-border ${resReady ? breathingBorderClassNames : ""} ${isPulsating ? "animate-pulse" : ""}`}>
            {resImg &&
                <>
                    <img
                        className={`w-full h-full rounded-lg`}
                        style={{ opacity: resOpacity, transition: 'opacity 0.6s' }}
                        src={resImg} />
                </>
            }
        </div>
    )
}

export default GenerateContainer