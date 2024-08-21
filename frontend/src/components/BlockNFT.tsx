import { cn } from "../utils/cn"
import { clsx as cl } from "clsx"
import { NFT, NFTAttributes } from "../types/NFT"
import { useState } from "react"
import Tooltip from "./Tooltip"
import { convertToIfpsURL } from "../utils/convertToIpfsURL"
import { Status } from "../types/Status"
import { RarityLevel } from "../data/rarities"
import { getRarityBorder } from "../utils/getRarityBorder"

type NFTGlowColor = "auto" | "none" | RarityLevel

export interface BlockNFTProps {
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
    const [status, setStatus] = useState<Status>("loading")

    // TODO: (MAINNET) each BlockNFT should be shift-clickable on hover
    // and open the formatted url to IPFS in a new tab
    const metadata: NFTAttributes[] = nftData.attributes

    let style: React.CSSProperties = {}
    if (glowColor !== "none") {
        if (glowColor === "auto") style = getRarityBorder(nftData.rarityGroup).style
        else {
            // handle custom glow color
            style = getRarityBorder(glowColor).style
        }
    }

    return (
        <div
            style={style}
            className={cn(
                "flex w-36 h-36 shadow-sm",
                "p-1 rounded-xl bg-light-bgDark dark:bg-dark-bgDark border",
                "border-light-border dark:border-dark-border select-none",
                additionalClasses,
            )}
        >
            <img
                onLoad={() => setStatus("ready")}
                draggable={false}
                className={cn(
                    "w-full h-full rounded-lg",
                    status !== "ready" && "hidden",
                    `nft-${nftData.id}-${nftData.image}`,
                )}
                src={convertToIfpsURL(nftData.image)}
                alt="NFT"
            />

            {/* Loading skeleton */}
            <div
                className={cl(
                    "flex flex-grow rounded-lg",
                    "bg-light-bgLight/75 dark:bg-dark-bgLight/50",
                    "animate-pulse",
                    status !== "loading" && "hidden",
                )}
            />

            {!disableMetadataOnHover && (
                <Tooltip
                    children={<BlockNFTMetadata metadata={metadata} />}
                    anchorSelect={`.nft-${nftData.id}-${nftData.image}`}
                />
            )}
        </div>
    )
}

const BlockNFTMetadata = (props: { metadata: NFTAttributes[] }) => {
    return (
        <div>
            {props.metadata.map((attr, idx) => (
                <p key={idx}>
                    {attr.trait_type}: &quot;{attr.value}&quot;
                </p>
            ))}
        </div>
    )
}

export default BlockNFT
