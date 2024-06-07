import { useEffect, useState } from "react"
import useRandomRarityBorder from "../hooks/useBorderAnimation"
import { getRarityBorder } from "../utils/getRarityBorder"
import { NFT } from "../types/NFT"
import { getRarityFromPerc } from "../utils/getRarityDataFromThreshold"
import { convertToIfpsURL } from "../utils/convertToIpfsURL"
import { RaritiesData } from "../types/RarityGroup"
import { formatBpToPercentage } from "../utils/getRarityDataFromThreshold"
import { cn } from "../utils/cn"

interface GenerateContainerProps {
    rolledNFT?: NFT
    isPulsating: boolean
    isGenerating: boolean
    rGroups: RaritiesData
}

const GenerateContainer = ({
    rolledNFT,
    isPulsating,
    isGenerating,
    rGroups,
}: GenerateContainerProps) => {
    const rarityAnimBorder = useRandomRarityBorder(isGenerating, 750, rGroups)
    const [resOpacity, setResOpacity] = useState<number>(0)

    // Dynamic styles based on passed rolledNFT
    const {
        style: breathingBorderStyle = {},
        className: breathingBorderClassNames = "",
    } = rolledNFT
        ? getRarityBorder(
              getRarityFromPerc(
                  formatBpToPercentage(rolledNFT.attributes[0].value),
                  rGroups,
              )[1],
              true,
          )
        : {}

    useEffect(() => {
        if (!rolledNFT) return
        setTimeout(() => setResOpacity(1), 100)
    }, [rolledNFT])

    return (
        <div
            style={
                rolledNFT
                    ? breathingBorderStyle
                    : isGenerating
                      ? rarityAnimBorder
                      : {}
            }
            className={cn(
                "flex justify-center items-center",
                "w-64 h-64 p-4 m-8 rounded-xl",
                "bg-light-bgDark dark:bg-dark-bgDark",
                "border-2 border-light-border dark:border-dark-border",
                rolledNFT && breathingBorderClassNames,
                isPulsating && "animate-pulse",
            )}
        >
            {rolledNFT && (
                <>
                    <img
                        className={`w-full h-full rounded-lg`}
                        style={{
                            opacity: resOpacity,
                            transition: "opacity 0.6s",
                        }}
                        src={convertToIfpsURL(rolledNFT.image)}
                    />
                </>
            )}
        </div>
    )
}

export default GenerateContainer
