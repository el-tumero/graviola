import type { Rarity } from "./types"

export const RarityName = [
    "common",
    "uncommon",
    "rare",
    "veryRare",
    "legendary",
] as const

export const rarityColors: Record<Rarity, string> = {
    common: "rgba(140, 140, 155, 0.8)",
    uncommon: "rgba(54, 202, 108, 0.8)",
    rare: "rgba(37, 99, 235, 0.8)",
    veryRare: "rgba(147, 51, 234, 0.8)",
    legendary: "rgba(239, 68, 68, 0.8)",
} as const

export const keywordToRarity = (id: number): Rarity => {
    if (id < 77) return "common"
    if (id < 92) return "uncommon"
    if (id < 97) return "rare"
    if (id < 99) return "veryRare"
    return "legendary"
}

export const scoreToRarity = (score: number, weights: number[]): Rarity => {
    if (score < weights[0]) return "common"
    if (score < weights[1]) return "uncommon"
    if (score < weights[2]) return "rare"
    if (score < weights[3]) return "veryRare"
    return "legendary"
}
