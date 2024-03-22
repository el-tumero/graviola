import { getRarityBorder } from "../../utils/getRarityBorder"
import { RarityGroupData } from "../../types/Rarity"

type BlockNFTPropsWithGlow = {
    src: string
    glow: true
    rarityGroup: RarityGroupData
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
    const { style: glowStyle = {} } = props.glow ? getRarityBorder(props.rarityGroup) : {};
    return (
        <div
            style={props.glow ? props.rarityGroup ? glowStyle : {} : {}}
            className={`
                flex w-36 h-36 shadow-sm
                p-1 rounded-xl bg-light-bgDark dark:bg-dark-bgDark border-2
                border-light-border dark:border-dark-border select-none
                ${props.disableMargin ? "m-0" : "mx-4"}
                ${props.additionalClasses}
            `}>
            <img draggable={false} className="w-full h-full rounded-lg" src={props.src} />
        </div>
    )
}

export default BlockNFT
