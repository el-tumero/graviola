export interface NFTAttributes {
    trait_type: string
    value: number
}

export interface NFT {
    id: number
    image: string
    description: string
    attributes: Array<NFTAttributes> // Meta attributes object (ERC721 opensea metadata standard)
}
