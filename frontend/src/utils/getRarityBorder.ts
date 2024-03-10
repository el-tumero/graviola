import { RarityLevel } from "../types/Rarity";
import { rarities } from "../rarityData";


export function getRarityColor(rarityLevel: RarityLevel): React.CSSProperties {
    return { color: rarities[rarityLevel].color }
}

export function getRarityBorder(rarityLevel: RarityLevel): React.CSSProperties {
    return {
        boxShadow: `0px 0px 20px 6px ${rarities[rarityLevel].color}`,
        WebkitBoxShadow: `0px 0px 20px 6px ${rarities[rarityLevel].color}`,
        MozBoxShadow: `0px 0px 20px 6px ${rarities[rarityLevel].color}`,
    }
}