import { getRarityBorder } from "../../utils/getRarityBorder"
import { RarityLevel } from "../../types/rarity"

type BlockNFTPropsWithGlow = {
    src: string
    glow: true
    rarityLevel: RarityLevel
    disableMargin?: boolean
    additionalClasses?: string
}

type BlockNFTPropsWithoutGlow = {
    src: string
    glow: false
    disableMargin?: boolean
    additionalClasses?: string
}

export type BlockNFTProps = BlockNFTPropsWithGlow | BlockNFTPropsWithoutGlow

const BlockNFT = (props: BlockNFTProps) => {
    return (
        <div style={props.glow ? props.rarityLevel ? getRarityBorder(props.rarityLevel) : {} : {}} className={`flex w-36 h-36 shadow-sm ${props.disableMargin ? "m-0" : "mx-4"} p-1 rounded-xl bg-light-bgDark dark:bg-dark-bgDark border-2 border-light-border dark:border-dark-border select-none ${props.additionalClasses}`}>
            <img draggable={false} className="w-full h-full rounded-lg" src={props.src} />
        </div>
    )
}

export default BlockNFT
