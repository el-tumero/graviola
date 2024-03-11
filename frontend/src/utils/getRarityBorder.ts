import { RarityLevel } from "../types/Rarity";
import { rarities, rarityScale } from "../rarityData";

export function getRarityColor(rarityLevel: RarityLevel): React.CSSProperties {
    return { color: rarities[rarityLevel].color }
}

export function getRarityBorder(rarityLevel: RarityLevel, breathingEffect?: boolean): { style: React.CSSProperties, className?: string } {
    const baseStyle = {
        boxShadow: `0px 0px 20px 6px ${rarities[rarityLevel].color}`,
        WebkitBoxShadow: `0px 0px 20px 6px ${rarities[rarityLevel].color}`,
        MozBoxShadow: `0px 0px 20px 6px ${rarities[rarityLevel].color}`,
        '--rarity-color': rarities[rarityLevel].color,
    }
    if (breathingEffect) {
        return {
            style: baseStyle,
            className: 'breathing-effect'
        }
    } else {
        return { style: baseStyle }
    }
}

export function getRandomRarity(): RarityLevel {
    const randomIndex = Math.floor(Math.random() * rarityScale.length)
    return rarityScale[randomIndex]
}