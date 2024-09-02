import { RarityLevel, rarities, rarityColors } from "../data/rarities"

export function getRarityBorder(
    rarityGroup: RarityLevel,
    breathingEffect?: boolean,
): {
    style: React.CSSProperties
    className: string
} {
    const rarityGroupColor = rarityColors[rarityGroup]
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
    const randomIndex = Math.floor(Math.random() * rarities.length)
    return rarities[randomIndex]
}
