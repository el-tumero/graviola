import { RarityLevel } from "./Rarity"

export interface Keyword {
    name: string
    rarityPerc: number
    rarity?: RarityLevel
}