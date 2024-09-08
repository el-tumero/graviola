import { rarityColors } from "../data/rarities"
import {
    getRarityFromScore,
    gerRarityFromScoreDefault,
} from "./getRarityFromScore"

export function getRarityColorFromScore(weights: number[], score: number) {
    return rarityColors[getRarityFromScore(weights, score)]
}

export function getRarityColorFromScoreDefault(score: number) {
    return rarityColors[gerRarityFromScoreDefault(score)]
}
