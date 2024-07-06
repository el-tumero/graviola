export enum RarityLevel {
    Common = "common",
    Uncommon = "uncommon",
    Rare = "rare",
    VeryRare = "veryRare",
    Legendary = "legendary",
}

// NOTE: This interface should always match 'RarityGroup' struct in GraviolaWell.sol
export interface RarityGroupData {
    name: string // Display name
    color: string // Css rgba color
    keywords: string[]
    startRange: number
    endRange: number
    weight: number
    minTokenWeight: number
}
