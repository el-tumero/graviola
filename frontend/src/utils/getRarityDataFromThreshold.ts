import { RarityData, RarityLevel } from "../types/Rarity";
import { rarityScale, rarities } from "../rarityData";

// Get rarityLevel and rarityData based on percentage Threshold (input 1-100)
export function getRarityFromThreshold(threshold: number): [RarityLevel, RarityData] {

        // Clamping the threshold to be within 0 and 100
        if (threshold > 100) threshold = 100;
        if (threshold < 0) threshold = 0;
    
        // Iterate over the rarityScale array in reverse order
        for (let i = rarityScale.length - 1; i >= 0; i--) {
            const rarityLevel = rarityScale[i];
            const rarityData = rarities[rarityLevel];
    
            // Since we're iterating in reverse, we check if the threshold is less than the next rarity's threshold (if any)
            const nextRarityData = rarities[rarityScale[i - 1]];
    
            if (threshold >= rarityData.threshold && (!nextRarityData || threshold < nextRarityData.threshold)) {
                return [rarityLevel, rarityData];
            }
        }

    // if (threshold > 100) threshold = 100
    // if (threshold < 0) threshold = 0
    // for (let rarityLevel of rarityScale) {
    //     const rarityData = rarities[rarityLevel]
    //     if (threshold >= rarityData.threshold) {
    //         return [rarityLevel, rarityData]
    //     }
    // }
    return [RarityLevel.Legendary, rarities[RarityLevel.Legendary]] // This is here just for the return type
}

// Get rarityLevel and rarityData from BP value, e.g. (1499 = 1,499%, 28230 = 28,230%)
export function formatBpToPercentage(bp: number): number {
    let divisor = 100000
    let length = bp.toString().length
    if (length <= 5) {
        divisor = 1000
    } else if (length >= 6) {
        divisor = 10000
    }
    return bp / divisor
}