import { useContext } from "react"
import { GraviolaContext } from "../contexts/GraviolaContext"
import { RarityGroupData, RarityLevel } from "../types/Rarity"
import { RaritiesData } from "../types/RarityGroup"

// Get RarityLevel and RGroupData from NFT rarity percentage (formatted)
export function getRarityFromPerc(threshold: number, rarities: RaritiesData): [RarityLevel, RarityGroupData] {
    // Clamp input
    threshold = Math.max(0, Math.min(threshold, 100))
    let perc = 0,
        prevPerc = 100

    for (const rarityLevel of Object.keys(rarities).sort(
        (a, b) => rarities[b as RarityLevel].rarityPerc - rarities[a as RarityLevel].rarityPerc,
    ) as RarityLevel[]) {
        const data = rarities[rarityLevel]
        perc += data.rarityPerc
        if (threshold <= prevPerc && threshold > 100 - perc) {
            return [rarityLevel, data]
        }
        prevPerc = 100 - perc
    }
    throw new Error("Threshold does not match any rarity level.")
}

// Get RarityLevel, RGroupData from RarityLevel enum type value
export function getRarityFromLevel(rarityLevel: RarityLevel, rarities: RaritiesData): [RarityLevel, RarityGroupData] {
    if (rarityLevel in rarities) {
        return [rarityLevel, rarities[rarityLevel]]
    }
    throw new Error(`Rarity level ${rarityLevel} does not exist in the rarities data.`)
}
