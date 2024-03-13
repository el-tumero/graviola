import { RarityLevel } from "../types/Rarity";
import { rarities, rarityScale } from "../rarityData";

export function getRarityColor(rarityLevel: RarityLevel): string {
    return rarities[rarityLevel].color
}

export function getRarityBorder(rarityLevel: RarityLevel): React.CSSProperties {
    return {
        boxShadow: `0px 0px 20px 6px ${rarities[rarityLevel].color}`,
        WebkitBoxShadow: `0px 0px 20px 6px ${rarities[rarityLevel].color}`,
        MozBoxShadow: `0px 0px 20px 6px ${rarities[rarityLevel].color}`,
    }
}

export function getRandomRarity(): RarityLevel {
    const randomIndex = Math.floor(Math.random() * rarityScale.length)
    return rarityScale[randomIndex]
}