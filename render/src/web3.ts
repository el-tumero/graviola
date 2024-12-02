import { JsonRpcProvider } from "ethers"
import type {
    GraviolaCollection,
    GraviolaCollectionReadProxy,
    GraviolaSeasonsArchive,
} from "@graviola/contracts"

import {
    GraviolaCollection__factory,
    GraviolaCollectionReadProxy__factory,
    GraviolaSeasonsArchive__factory,
} from "@graviola/contracts"

import { addresses as target } from "@graviola/contracts"

import { type Card, type Metadata } from "./types/Card"
import type { Keyword } from "./types/Keyword"
import { keywordToRarity, scoreToRarity } from "./utils/rarity"
import type { DeployedContractAddressData } from "@graviola/contracts/utils/contracts"
import type { MetadataFlat } from "@graviola/event"

let rpcUrl: string =
    "https://dawn-delicate-breeze.arbitrum-sepolia.quiknode.pro/"

let addresses: DeployedContractAddressData = target.testnet

if (import.meta.env.CHAIN_NET === "local") {
    rpcUrl = "http://localhost:8545"
    addresses = target.local
}

const provider = new JsonRpcProvider(rpcUrl)

export const getCollectionContract = (): GraviolaCollection =>
    GraviolaCollection__factory.connect(addresses.COLLECTION_ADDRESS, provider)

export const getCollectionReadProxy = (): GraviolaCollectionReadProxy =>
    GraviolaCollectionReadProxy__factory.connect(
        addresses.COLLECTION_READ_PROXY_ADDRESS,
        provider,
    )

export const getArchiveContract = (): GraviolaSeasonsArchive =>
    GraviolaSeasonsArchive__factory.connect(
        addresses.SEASONS_ARCHIVE_ADDRESS,
        provider,
    )

export const descriptionToKeywords = (description: string): string[] => {
    return description.slice(130).trim().split(",")
}

export const getCardsTotalSupply = async (): Promise<number> => {
    const collection = getCollectionContract()
    return Number(await collection.totalSupply())
}

export const getCardsTotalSupplyByOwner = async (
    owner: string,
): Promise<number> => {
    const collection = getCollectionContract()
    return Number(await collection.balanceOf(owner))
}

export const getCards = async (
    start: number,
    end: number,
    owner?: string,
): Promise<Card[]> => {
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

export const metadataFlatToCard = (
    metadata: MetadataFlat,
    id?: bigint,
): Card => {
    const { description, image, probability, score, seasonId } = metadata

    return {
        id: id ?? 0n,
        description,
        image,
        keywords: descriptionToKeywords(description),
        rarity: scoreToRarity(score, [4, 11, 15, 20]),
        probability: probability,
        score: score,
    }
}

export const getKeywords = async (): Promise<Keyword[]> => {
    const archive = getArchiveContract()
    const keywords = await archive.getKeywordsCurrentSeason()
    return keywords.map((keyword, id) => ({
        name: keyword,
        rarity: keywordToRarity(id),
    }))
}
