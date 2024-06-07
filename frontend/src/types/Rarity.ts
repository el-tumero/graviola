import { Keyword } from "./Keyword"

export enum RarityLevel {
    Common = "common",
    Uncommon = "uncommon",
    Rare = "rare",
    VeryRare = "veryRare",
    Legendary = "legendary",
}

export interface RarityGroupData {
    name: string // Display name
    rarityPerc: number // Lower percentage bound. E.g: 30 = Applies to NFTs with 30% drop chance (and higher)
    color: string // Css rgba color
    keywords: Keyword[]
}
