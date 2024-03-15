export enum RarityLevel {
    Common = "common",
    Uncommon = "uncommon",
    Rare = "rare",
    VeryRare = "veryRare",
    Legendary = "legendary",
}

export interface RarityData {
    name: string // Display name
    threshold: number // Lower percentage bound. E.g: 30 = Applies to NFTs with 30% drop chance (and higher)
    color: string // Css rgba color
}