import { RarityGroupData, RarityLevel } from "../types/Rarity"
import { rarityScale } from "../rarityData"

export function getRarityBorder(
    rarityGroup: RarityGroupData,
    breathingEffect?: boolean,
): {
    style: React.CSSProperties
    className: string
} {
    const baseStyle = {
        boxShadow: `0px 0px 20px 6px ${rarityGroup.color}`,
        WebkitBoxShadow: `0px 0px 20px 6px ${rarityGroup.color}`,
        MozBoxShadow: `0px 0px 20px 6px ${rarityGroup.color}`,
        "--rarity-color": rarityGroup.color,
    }
    if (breathingEffect) {
        return {
            style: baseStyle,
            className: "breathing-effect",
        }
    } else {
        return { style: baseStyle, className: "" }
    }
}

export function getRandomRarity(): RarityLevel {
    const randomIndex = Math.floor(Math.random() * rarityScale.length)
    return rarityScale[randomIndex]
}
