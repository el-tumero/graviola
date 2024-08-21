import { RarityLevel } from "../data/rarities"

export interface NFTAttributes {
    trait_type: string
    value: number
}

export interface NFT {
    id: number
    description: string
    image: string
    rarityGroup: RarityLevel
    seasonId?: number
    attributes: Array<NFTAttributes> // Meta attributes object (ERC721 opensea metadata standard)
}
