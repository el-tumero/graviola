import { useEffect, useState } from "react"
import useRandomRarityBorder from "../../../hooks/useBorderAnimation"
import { getRarityBorder } from "../../../utils/getRarityBorder"
import { NFT } from "../../../types/NFT"
import { convertToIfpsURL } from "../../../utils/convertToIpfsURL"
import { RarityLevel } from "../../../data/rarities"
import { formatBpToPercentage } from "../../../utils/format"
import { cn } from "../../../utils/cn"

interface GenerateContainerProps {
    rolledNFT?: NFT
    runBorderAnim: boolean
    rGroups: RarityLevel[]
}

const GenerateContainer = ({
    rolledNFT,
    runBorderAnim,
    rGroups,
}: GenerateContainerProps) => {
    const rarityAnimBorder = useRandomRarityBorder(runBorderAnim, 750, rGroups)
    const [resOpacity, setResOpacity] = useState<number>(0)

    // Dynamic styles based on rolledNFT
    let rarityBorderObject = { style: {} as React.CSSProperties, className: "" }

    if (rolledNFT) {
        const percentage = formatBpToPercentage(rolledNFT.attributes[0].value)
        // const weights = rolledNFT.attributes TODO
        rarityBorderObject = getRarityBorder("common", true) // FIXME
    }

    const {
        style: breathingBorderStyle = {},
        className: breathingBorderClassNames = "",
    } = rarityBorderObject

    useEffect(() => {
        if (!rolledNFT) return
        setTimeout(() => setResOpacity(1), 100)
    }, [rolledNFT])

    return (
        <div
            style={
                rolledNFT
                    ? breathingBorderStyle
                    : runBorderAnim
                      ? rarityAnimBorder
                      : {}
            }
            className={cn(
                "flex justify-center items-center",
                "w-64 h-64 p-4 rounded-xl",
                "bg-light-bgDark dark:bg-dark-bgDark",
                "border border-light-border dark:border-dark-border border-dashed",
                rolledNFT && breathingBorderClassNames,
            )}
        >
            {rolledNFT && (
                <img
                    className={`w-full h-full rounded-lg`}
                    style={{
                        opacity: resOpacity,
                        transition: "opacity 0.6s",
                    }}
                    src={convertToIfpsURL(rolledNFT.image)}
                />
            )}
        </div>
    )
}

export default GenerateContainer
