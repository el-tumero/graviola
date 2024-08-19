export interface NFTAttributes {
    trait_type: string
    value: number
}

export interface NFT {
    id: number
    description: string
    image: string
    rarity: number
    weightSum: number
    seasonId?: number
    attributes: Array<NFTAttributes> // Meta attributes object (ERC721 opensea metadata standard)
}
