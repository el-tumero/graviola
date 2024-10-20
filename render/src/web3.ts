import { JsonRpcProvider } from "ethers"
import type { GraviolaCollection } from "../../contracts/typechain-types"
import { GraviolaCollection__factory } from "../../contracts/typechain-types/index"
import addresses from "../../contracts/addresses-testnet.json"
import {
    rarityColors,
    type Card,
    type Metadata,
    type Rarity,
} from "./types/Card"

const rpcUrl = "https://dawn-delicate-breeze.arbitrum-sepolia.quiknode.pro/"

const provider = new JsonRpcProvider(rpcUrl)

export const getCollectionContract: () => GraviolaCollection = () => {
    return GraviolaCollection__factory.connect(
        addresses.COLLECTION_ADDRESS,
        provider,
    )
}

const descriptionToKeywords: (description: string) => string[] = (
    description,
) => {
    return description.slice(130).trim().split(",")
}

const scoreToRarity: (score: number, weights: number[]) => Rarity = (
    score,
    weights,
) => {
    if (score < weights[0]) return "common"
    if (score < weights[1]) return "uncommon"
    if (score < weights[2]) return "rare"
    if (score < weights[3]) return "veryRare"
    return "legendary"
}

export const rarityToColor: (rarity: Rarity) => string = (rarity) => {
    return rarityColors[rarity]
}

export const getCardsTotalSupply: () => Promise<number> = async () => {
    const collection = getCollectionContract()
    return Number(await collection.totalSupply())
}

export const getCards: (start: number, end: number) => Promise<Card[]> = async (
    start,
    end,
) => {
    const collection = getCollectionContract()

    const [ids, rawData] = await collection.tokenRange(start, end)

    const metadata = rawData.map<Metadata>((raw) => ({
        ...JSON.parse(Buffer.from(raw.slice(29), "base64url").toString()),
    }))

    return metadata.map<Card>((data, i) => {
        const { description, image } = data
        const [probability, score] = data.attributes

        return {
            id: ids[i],
            description,
            image,
            keywords: descriptionToKeywords(description),
            rarity: scoreToRarity(score.value, [4, 11, 15, 20]),
            probability: probability.value,
            score: score.value,
        }
    })
}
