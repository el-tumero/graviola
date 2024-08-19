import {
    RarityLevel,
    rarityGroups,
    rarityGroupColors,
} from "../data/rarityData"

export function getRarityBorder(
    rarityGroup: RarityLevel,
    breathingEffect?: boolean,
): {
    style: React.CSSProperties
    className: string
} {
    const rarityGroupColor = rarityGroupColors[rarityGroup]
    const baseStyle = {
        boxShadow: `0px 0px 20px 6px ${rarityGroupColor}`,
        WebkitBoxShadow: `0px 0px 20px 6px ${rarityGroupColor}`,
        MozBoxShadow: `0px 0px 20px 6px ${rarityGroupColor}`,
        "--rarity-color": rarityGroupColor,
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
    const randomIndex = Math.floor(Math.random() * rarityGroups.length)
    return rarityGroups[randomIndex]
}
