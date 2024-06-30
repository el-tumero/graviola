import { RarityGroupData, RarityLevel } from "../types/Rarity"
import { RaritiesData } from "../types/RarityGroup"

// Get RarityLevel and RGroupData from NFT rarity percentage (formatted)
// return [RarityLevel, RarityGroupData]
export function getRarityFromPerc(perc: number, rarities: RaritiesData): [RarityLevel, RarityGroupData] {
    perc = Math.max(0, Math.min(perc, 100)) // Clamp input

    for (const rarityLevel of Object.keys(rarities).sort(
        (a, b) => rarities[b as RarityLevel].startRange - rarities[a as RarityLevel].endRange,
    ) as RarityLevel[]) {
        if (perc >= rarities[rarityLevel].startRange) {
            return [rarityLevel, rarities[rarityLevel]]
        }
    }
    throw new Error("Threshold does not match any rarity level.")
}

// Get RarityLevel, RGroupData from RarityLevel enum type value
export function getRarityFromLevel(rarityLevel: RarityLevel, rarities: RaritiesData): RarityGroupData {
    if (rarityLevel in rarities) {
        return rarities[rarityLevel]
    }
    throw new Error(`Rarity level ${rarityLevel} does not exist in the rarities data.`)
}
