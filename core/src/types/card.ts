import type { Rarity } from "./rarity"

export type Metadata = {
    description: string
    image: string
    attributes: MetadataAttribute[]
}

export type Card = {
    id: string
    description: string
    image: string
    keywords: string[]
    rarity: Rarity
    probability: number
    score: number
}

export type CardImageSize = "small" | "medium" | "large"

export type MetadataAttribute = {
    trait_type: string
    value: number
}
