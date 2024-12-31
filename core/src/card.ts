import { metadataToKeywords } from "./keyword"
import { keywordsToScore, scoreToRarity } from "./rarity"
import type { Card, Metadata, RawProperties } from "./types"
import { toUtf8String, toBigInt } from "ethers"

export const parseProperties = ([, value]: RawProperties): Metadata => {
    return {
        prompt: toUtf8String(value[0]),
        image: toUtf8String(value[1]),
        wordIds: hexStringToNumberArray(value[2]),
        seasonId: "0",
    }
}

const hexStringToNumberArray = (hexString: string): number[] => {
    if (hexString.length < 2 || hexString.length % 2 !== 0) return []
    return hexString
        .slice(2)
        .match(/.{1,2}/g)!
        .map((byte) => parseInt(byte, 16))
}

export const metadataToCard = (tokenId: bigint, metadata: Metadata): Card => {
    const keywords = metadataToKeywords(metadata)
    const score = keywordsToScore(keywords)

    return {
        id: "0x" + tokenId.toString(16).slice(0, 14) + "...",
        description: metadata.prompt,
        image: metadata.image,
        keywords,
        rarity: scoreToRarity(score),
        probability: 0,
        score,
    }
}

export const propertiesToCard = (
    tokenId: bigint,
    properties: RawProperties,
): Card => {
    return metadataToCard(tokenId, parseProperties(properties))
}
