import { rarityColors, type Rarity } from "../types/Rarity"

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

export const rarityToColor = (rarity: Rarity): string => {
    return rarityColors[rarity]
}

export const rarityTextColor: Record<Rarity, string> = {
    common: "text-rarity-common",
    uncommon: "text-rarity-uncommon",
    rare: "text-rarity-rare",
    veryRare: "text-rarity-veryRare",
    legendary: "text-rarity-legendary",
}

export const rarityBoxShadow: Record<Rarity, string> = {
    common: "shadow-rarity-common",
    uncommon: "shadow-rarity-uncommon",
    rare: "shadow-rarity-rare",
    veryRare: "shadow-rarity-veryRare",
    legendary: "shadow-rarity-legendary",
}
