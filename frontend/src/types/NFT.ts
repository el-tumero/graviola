import { RarityLevel } from "../data/rarities"

export interface NFTAttributes {
    trait_type: string
    value: number
}

export interface RawNFTData {
    description: string
    image: string
    attributes: Array<NFTAttributes> // Meta attributes object (ERC721 opensea metadata standard)
}

export interface NFT extends RawNFTData {
    id: number
    rarityGroup: RarityLevel
    seasonId: number
    probability: number
}
