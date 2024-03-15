import { RarityData, RarityLevel } from "../types/Rarity";
import { rarityScale, rarities } from "../rarityData";

// Get rarityLevel and rarityData based on percentage Threshold (input 1-100)
export function getRarityFromThreshold(threshold: number): [RarityLevel, RarityData] {
    if (threshold > 100) threshold = 100
    if (threshold < 0) threshold = 0
    for (let rarityLevel of rarityScale) {
        const rarityData = rarities[rarityLevel]
        if (threshold >= rarityData.threshold) {
            return [rarityLevel, rarityData]
        }
    }
    return [RarityLevel.Legendary, rarities[RarityLevel.Legendary]] // This is here just for the return type
}

// Get rarityLevel and rarityData from BP value, e.g. (1499 = 1,499%, 28230 = 28,230%)
export function formatBpToPercentage(bp: number): number {
    const percentage = bp / 10000
    return percentage
}