export const rarityGroups = [
    "common",
    "uncommon",
    "rare",
    "veryRare",
    "legendary",
] as const

export type RarityLevel = (typeof rarityGroups)[number]

export const rarityGroupColors: Record<RarityLevel, string> = {
    common: "rgba(140, 140, 155, 0.8)",
    uncommon: "rgba(54, 202, 108, 0.8)",
    rare: "rgba(37, 99, 235, 0.8)",
    veryRare: "rgba(147, 51, 234, 0.8)",
    legendary: "rgba(239, 68, 68, 0.8)",
}
