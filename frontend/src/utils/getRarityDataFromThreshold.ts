import { RarityGroupData, RarityLevel } from "../types/Rarity";

// Get rarityLevel and rarityData index based on percentage Threshold (input 1-100)
export function getRarityFromThreshold(threshold: number, rGroups: Record<string, RarityGroupData>): [string, RarityGroupData] {

    // Clamp input
    threshold = Math.max(0, Math.min(threshold, 100));

    let perc = 0, prevPerc = 100

    for (const rarityLevel of Object.keys(rGroups).sort((a, b) => rGroups[b].rarityPerc - rGroups[a].rarityPerc)) {
        const data = rGroups[rarityLevel]
        perc += data.rarityPerc

        if (threshold <= prevPerc && threshold > 100 - perc) {
            return [rarityLevel, data]
        }
        prevPerc = 100 - perc
    }

    throw new Error("Threshold does not match any rarity level.")
}

// Get rarityLevel and rarityData from BP value, e.g. (1499 = 1,499%, 28230 = 28,230%)
export function formatBpToPercentage(bp: number): number {
    let divisor = 10_000
    return bp / divisor
}