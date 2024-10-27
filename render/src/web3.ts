import { JsonRpcProvider } from "ethers"
import type {
    GraviolaCollection,
    GraviolaCollectionReadProxy,
} from "../../contracts/typechain-types"
import {
    GraviolaCollection__factory,
    GraviolaCollectionReadProxy__factory,
} from "../../contracts/typechain-types/index"
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

export const getCollectionReadProxy: () => GraviolaCollectionReadProxy = () => {
    return GraviolaCollectionReadProxy__factory.connect(
        addresses.COLLECTION_READ_PROXY_ADDRESS,
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

export const getRarityBorderStyles = (
    rarity: Rarity,
    breathingEffect: boolean,
): { style: Record<string, string>; className: string } => {
    const rarityColor = rarityToColor(rarity)
    const baseStyle = {
        boxShadow: `0px 0px 20px 6px ${rarityColor}`,
        WebkitBoxShadow: `0px 0px 20px 6px ${rarityColor}`,
        MozBoxShadow: `0px 0px 20px 6px ${rarityColor}`,
        "--rarity-color": rarityColor,
    }
    if (breathingEffect) {
        return {
            style: baseStyle,
            className: "breathing-effect",
        }
    } else {
        return { style: baseStyle, className: "" }
    }
}

export const getCardsTotalSupply: () => Promise<number> = async () => {
    const collection = getCollectionContract()
    return Number(await collection.totalSupply())
}

export const getCardsTotalSupplyByOwner: (
    owner: string,
) => Promise<number> = async (owner) => {
    const collection = getCollectionContract()
    return Number(await collection.balanceOf(owner))
}

export const getCards: (
    start: number,
    end: number,
    owner?: string,
) => Promise<Card[]> = async (start, end, owner) => {
    const collection = getCollectionReadProxy()

    const [ids, rawData] = owner
        ? await collection.tokenOfOwnerRange(owner, start, end)
        : await collection.tokenRange(start, end)

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
