export const RarityName = [
    "common",
    "uncommon",
    "rare",
    "veryRare",
    "legendary",
] as const

export type Rarity = (typeof RarityName)[number]

export const rarityColors: Record<Rarity, string> = {
    common: "rgba(140, 140, 155, 0.8)",
    uncommon: "rgba(54, 202, 108, 0.8)",
    rare: "rgba(37, 99, 235, 0.8)",
    veryRare: "rgba(147, 51, 234, 0.8)",
    legendary: "rgba(239, 68, 68, 0.8)",
} as const
