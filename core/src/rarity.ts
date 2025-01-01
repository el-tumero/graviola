import type { Keyword, Rarity } from "./types"

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

export const wordIdToRarity = (id: number): Rarity => {
    if (id < 77) return "common"
    if (id < 92) return "uncommon"
    if (id < 97) return "rare"
    if (id < 99) return "veryRare"
    return "legendary"
}

const keywordToWeight = ({ rarity }: Keyword): number => {
    switch (rarity) {
        case "common":
            return 1
        case "uncommon":
            return 3
        case "rare":
            return 5
        case "veryRare":
            return 8
        case "legendary":
            return 12
    }
}

export const rarityToTextColor = (rarity: Rarity): string => {
    switch (rarity) {
        case "common":
            return "text-rarity-common"
        case "uncommon":
            return "text-rarity-uncommon"
        case "rare":
            return "text-rarity-rare"
        case "veryRare":
            return "text-rarity-veryRare"
        case "legendary":
            return "text-rarity-legendary"
    }
}

export const keywordsToScore = (keywords: Keyword[]): number => {
    return keywords.reduce((acc, keyword) => acc + keywordToWeight(keyword), 0)
}

export const scoreToRarity = (score: number): Rarity => {
    if (score < 3) return "common"
    if (score < 10) return "uncommon"
    if (score < 14) return "rare"
    if (score < 19) return "veryRare"
    return "legendary"
}
