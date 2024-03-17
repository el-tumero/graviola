import { RarityData, RarityLevel } from "./types/Rarity"

export const rarityScale: Array<RarityLevel> = [
    RarityLevel.Common,
    RarityLevel.Uncommon,
    RarityLevel.Rare,
    RarityLevel.VeryRare,
    RarityLevel.Legendary
]

// Data for NFT rarities
export const rarities: Record<RarityLevel, RarityData> = {
    [RarityLevel.Common]: {
        name: "Common",
        threshold: 25,
        color: "rgba(140, 140, 155, 0.8)",
    },
    [RarityLevel.Uncommon]: {
        name: "Uncommon",
        threshold: 15,
        color: "rgba(54, 202, 108, 0.8)",
    },
    [RarityLevel.Rare]: {
        name: "Rare",
        threshold: 8,
        color: "rgba(37, 99, 235, 0.8)",
    },
    [RarityLevel.VeryRare]: {
        name: "Very Rare",
        threshold: 1.5,
        color: "rgba(147, 51, 234, 0.8)",
    },
    [RarityLevel.Legendary]: {
        name: "Legendary",
        threshold: 0,
        color: "rgba(239, 68, 68, 0.8)",
    }
}