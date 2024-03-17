import { useEffect, useState } from "react"
import useRandomRarityBorder from "../hooks/useBorderAnimation"
import { getRarityBorder } from "../utils/getRarityBorder"
import { NFT } from "../types/NFT"
import { getRarityFromThreshold } from "../utils/getRarityDataFromThreshold"
import { convertToIfpsURL } from "../utils/convertToIpfsURL"

interface GenerateContainerProps {
    rolledNFT?: NFT
    isPulsating: boolean
    isGenerating: boolean
}

const GenerateContainer = ({ rolledNFT, isPulsating, isGenerating }: GenerateContainerProps) => {

    const rarityAnimBorder = useRandomRarityBorder(isGenerating, 750)
    const [resOpacity, setResOpacity] = useState<number>(0)

    // Dynamic styles based on passed rolledNFT
    const {
        style: breathingBorderStyle = {},
        className: breathingBorderClassNames = ""
    } = rolledNFT ? getRarityBorder(getRarityFromThreshold(rolledNFT.attributes[0].value)[0], true) : {};

    useEffect(() => {
        if (!rolledNFT) return
        setTimeout(() => setResOpacity(1), 100)
    }, [rolledNFT])

    return (
        // TODO: Change this empty style{} to a passed as prop resultRarity
        <div
            style={rolledNFT ? breathingBorderStyle : isGenerating ? rarityAnimBorder : {}}
            className={`
                flex justify-center items-center
                w-64 h-64 p-4 m-8 rounded-xl
                bg-light-bgDark dark:bg-dark-bgDark
                border-2 border-light-border dark:border-dark-border
                ${rolledNFT ? breathingBorderClassNames : ""}
                ${isPulsating ? "animate-pulse" : ""}
            `}
        >
            {rolledNFT &&
                <>
                    <img
                        className={`w-full h-full rounded-lg`}
                        style={{ opacity: resOpacity, transition: 'opacity 0.6s' }}
                        src={convertToIfpsURL(rolledNFT.image)} />
                </>
            }
        </div>
    )
}

export default GenerateContainer