export type Card = {
    id: bigint
    description: string
    image: string
    attributes: CardAttribute[]
}

type CardAttribute = {
    trait_type: string
    value: string
}
