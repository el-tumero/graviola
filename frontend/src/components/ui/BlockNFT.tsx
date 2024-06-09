import { getRarityBorder } from "../../utils/getRarityBorder"
import { cn } from "../../utils/cn"
import { NFT } from "../../types/NFT"
import { getRarityFromPerc } from "../../utils/getRarityData"
import { convertToIfpsURL } from "../../utils/convertToIpfsURL"
import { RarityLevel } from "../../types/Rarity"
import { rarityGroupColors } from "../../rarityData"

type NFTGlowColor = "auto" | "none" | RarityLevel
interface BlockNFTProps {
    nftData: NFT               // Pass full NFT object to preview meta object on hover
    glowColor: NFTGlowColor       // 'Auto' will inherit color from NFT data. Can be overwritten
    additionalClasses?: string // Extra classes for the div, not for the img tag
}

const BlockNFT = ({ nftData, glowColor, additionalClasses }: BlockNFTProps) => {
    const [, rData] = getRarityFromPerc(nftData.attributes[0].value)
    let glowStyles = { style: {} }
    if (glowColor !== "none") {
        if (glowColor === "auto") glowStyles.style = getRarityBorder(rData)
        else {
            const customBorderStyles = {

            }
        }
    }
    // const { style: glowStyle = {} } = (glowColor !== "none")
    //     ? (glowColor === "auto") ? getRarityBorder(rData) : { style: rarityGroupColors[glowColor as RarityLevel] }
    //     : {}
    return (
        <div
            style={glowStyles}
            className={cn(
                "flex w-36 h-36 shadow-sm",
                "p-1 rounded-xl bg-light-bgDark dark:bg-dark-bgDark border-2",
                "border-light-border dark:border-dark-border select-none",
                "mx-4",
                additionalClasses,
            )}
        >
            <img
                draggable={false}
                className="w-full h-full rounded-lg"
                src={convertToIfpsURL(nftData.image)}
            />
        </div>
    )
}

export default BlockNFT
