import { getRarityBorder } from "../utils/getRarityBorder"
import { cn } from "../utils/cn"
import { clsx as cl } from "clsx"
import { NFT, NFTAttributes } from "../types/NFT"
import { getRarityFromLevel, getRarityFromPerc } from "../utils/getRarityData"
import { formatBpToPercentage } from "../utils/format"
import { ITooltip } from "react-tooltip"
import Tooltip from "./Tooltip"
import { convertToIfpsURL } from "../utils/convertToIpfsURL"
import { RarityLevel } from "../types/Rarity"

type NFTGlowColor = "auto" | "none" | RarityLevel

interface BlockNFTProps {
    nftData: NFT // Pass full NFT object to preview meta object on hover
    glowColor: NFTGlowColor // 'Auto' will inherit color from NFT data. Can be overwritten
    additionalClasses?: string // Extra classes for the div, not for the img tag
    disableMetadataOnHover?: true // Disable metadata object element on hover
}

const BlockNFT = ({
    nftData,
    glowColor,
    disableMetadataOnHover,
    additionalClasses,
}: BlockNFTProps) => {
    const [, rData] = getRarityFromPerc(
        formatBpToPercentage(nftData.attributes[0].value),
    )
    let style: React.CSSProperties = {}
    if (glowColor !== "none") {
        if (glowColor === "auto") style = getRarityBorder(rData).style
        else {
            // handle custom/hardcoded glow colors
            const [, glowLevelData] = getRarityFromLevel(glowColor)
            style = getRarityBorder(glowLevelData).style
        }
    }

    // TODO: Ideally each BlockNFT should be shift-clickable on hover
    // and open the formatted url to IPFS in a new tab
    const metadata: NFTAttributes[] = nftData.attributes

    return (
        <div
            style={style}
            className={cn(
                "flex w-36 h-36 shadow-sm",
                "p-1 rounded-xl bg-light-bgDark dark:bg-dark-bgDark border-2",
                "border-light-border dark:border-dark-border select-none",
                additionalClasses,
            )}
        >
            <img
                draggable={false}
                className={cl(
                    "w-full h-full rounded-lg",
                    `nft-${nftData.image}`,
                )}
                src={convertToIfpsURL(nftData.image)}
                alt="NFT"
            />

            {!disableMetadataOnHover && (
                <Tooltip
                    children={<BlockNFTMetadata metadata={metadata} />}
                    anchorSelect={`.nft-${nftData.image}`}
                />
            )}
        </div>
    )
}

const BlockNFTMetadata = (props: { metadata: NFTAttributes[] }) => {
    return (
        <div>
            {props.metadata.map((attr) => (
                <p>
                    {attr.trait_type}: '{attr.value}'
                </p>
            ))}
        </div>
    )
}

export default BlockNFT
