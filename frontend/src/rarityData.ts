import { RarityData, RarityLevel } from "./types/Rarity"

export const rarityScale: Array<RarityLevel> = [RarityLevel.Common, RarityLevel.Uncommon, RarityLevel.Rare, RarityLevel.VeryRare, RarityLevel.Legendary]

// Data for NFT rarities
export const rarities: Record<RarityLevel, RarityData> = {
    [RarityLevel.Common]: {
        name: "Common",
        threshold: 30,
        color: "rgba(82, 82, 91, 0.8)",
    },
    [RarityLevel.Uncommon]: {
        name: "Uncommon",
        threshold: 25,
        color: "rgba(74, 222, 128, 0.8)",
    },
    [RarityLevel.Rare]: {
        name: "Rare",
        threshold: 4,
        color: "rgba(37, 99, 235, 0.8)",
    },
    [RarityLevel.VeryRare]: {
        name: "Very Rare",
        threshold: 0.5,
        color: "rgba(147, 51, 234, 0.8)",
    },
    [RarityLevel.Legendary]: {
        name: "Legendary",
        threshold: 0,
        color: "rgba(239, 68, 68, 0.8)",
    }
};
