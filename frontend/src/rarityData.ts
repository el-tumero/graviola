import { RarityLevel } from "./types/Rarity"

export const rarityScale: Array<RarityLevel> = [
    RarityLevel.Common,
    RarityLevel.Uncommon,
    RarityLevel.Rare,
    RarityLevel.VeryRare,
    RarityLevel.Legendary,
]

export const rarityGroupColors: Record<RarityLevel, string> = {
    [RarityLevel.Common]: "rgba(140, 140, 155, 0.8)",
    [RarityLevel.Uncommon]: "rgba(54, 202, 108, 0.8)",
    [RarityLevel.Rare]: "rgba(37, 99, 235, 0.8)",
    [RarityLevel.VeryRare]: "rgba(147, 51, 234, 0.8)",
    [RarityLevel.Legendary]: "rgba(239, 68, 68, 0.8)",
}
