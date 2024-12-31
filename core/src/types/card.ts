import type { Keyword } from "./keyword"
import type { Rarity } from "./rarity"

export type RawProperties = [string[], string[]]

export type Metadata = {
    prompt: string
    image: string
    wordIds: number[]
    seasonId: string
}

export type Card = {
    id: string
    description: string
    image: string
    keywords: Keyword[]
    rarity: Rarity
    probability: number
    score: number
}

export type CardImageSize = "small" | "medium" | "large"
