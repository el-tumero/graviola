import { type Rarity, rarityColors } from "@graviola/core"

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
