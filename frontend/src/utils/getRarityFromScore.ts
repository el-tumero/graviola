import { minWeightGroup, RarityLevel } from "../data/rarities"

export function getRarityFromScore(
    weights: number[],
    score: number,
): RarityLevel {
    if (score < weights[0]) return "common"
    if (score < weights[1]) return "uncommon"
    if (score < weights[2]) return "rare"
    if (score < weights[3]) return "veryRare"
    return "legendary"
}

export function gerRarityFromScoreDefault(score: number) {
    return getRarityFromScore(minWeightGroup.slice(1), score)
}
