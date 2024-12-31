import { wordIdToRarity } from "./rarity"
import type { Keyword, Metadata } from "./types"

export const metadataToKeywords = ({
    prompt,
    wordIds,
}: Metadata): Keyword[] => {
    return prompt
        .slice(130)
        .trim()
        .split(",")
        .map((name, index) => ({
            name,
            rarity: wordIdToRarity(wordIds[index]),
        }))
}
