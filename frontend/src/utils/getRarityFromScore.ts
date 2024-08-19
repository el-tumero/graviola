import { RarityLevel } from "../data/rarities"

export function getRarityFromScore(
    weights: number[],
    score: number,
): RarityLevel {
    if (score < weights[4]) return "common"
    if (score < weights[3]) return "uncommon"
    if (score < weights[2]) return "rare"
    if (score < weights[1]) return "veryRare"
    return "legendary"
}
