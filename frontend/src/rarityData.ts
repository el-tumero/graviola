import { RarityData, RarityLevel } from "./types/rarity"

// Data for NFT rarities
export const rarities: Record<RarityLevel, RarityData> = {
    [RarityLevel.Common]: {
        name: RarityLevel.Common,
        threshold: 30,
        color: "rgba(82, 82, 91, 0.8)",
    },
    [RarityLevel.Uncommon]: {
        name: RarityLevel.Uncommon,
        threshold: 15,
        color: "rgba(74, 222, 128, 0.8)",
    },
    [RarityLevel.Rare]: {
        name: RarityLevel.Rare,
        threshold: 5,
        color: "rgba(37, 99, 235, 0.8)",
    },
    [RarityLevel.VeryRare]: {
        name: RarityLevel.VeryRare,
        threshold: 0.5,
        color: "rgba(147, 51, 234, 0.8)",
    },
    [RarityLevel.Legendary]: {
        name: RarityLevel.Legendary,
        threshold: 0,
        color: "rgba(239, 68, 68, 0.8)",
    }
};
