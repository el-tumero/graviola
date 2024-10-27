import type { Rarity } from "./Rarity"

export type Metadata = {
    description: string
    image: string
    attributes: MetadataAttribute[]
}

export type Card = {
    id: bigint
    description: string
    image: string
    keywords: string[]
    rarity: Rarity
    probability: number
    score: number
}

export type MetadataAttribute = {
    trait_type: string
    value: number
}
