import { RarityLevel } from "../data/rarityData"

export function getRarityGroup(weightSum: number): RarityLevel {
    if (weightSum < 3) return "common"
    if (weightSum < 10) return "uncommon"
    if (weightSum < 14) return "rare"
    if (weightSum < 19) return "veryRare"
    return "legendary"
}
