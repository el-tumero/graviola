import { rarityColors } from "../data/rarities"
import { getRarityFromScore } from "./getRarityFromScore"

export function getRarityColorFromScore(weights: number[], score: number) {
    return rarityColors[getRarityFromScore(weights, score)]
}
