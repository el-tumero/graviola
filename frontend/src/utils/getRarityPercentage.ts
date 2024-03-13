import { RarityLevel } from "../types/Rarity";
import { rarities, rarityScale } from "../rarityData";

export function getRarityPercentageString(rarityLevel: RarityLevel) {
    const index = rarityScale.findIndex(level => level === rarityLevel)
    if (index === 0) {
        return `${(100 - rarities[rarityLevel as RarityLevel].threshold).toString()}%`
    } else if (index === rarityScale.length - 1) {
        const beforeLastThreshold = rarities[rarityScale[rarityScale.length - 2]].threshold
        const beforeLastThresholdRounded = Math.round(beforeLastThreshold)
        return `${beforeLastThresholdRounded - beforeLastThreshold}%`;
    } else {
        return `${rarities[rarityScale[index]].threshold}%`
    }
}