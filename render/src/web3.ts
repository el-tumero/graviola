import { JsonRpcProvider } from "ethers"
import type {
    GraviolaCollection,
    GraviolaCollectionReadProxy,
    GraviolaKeywordsVaultBasic,
} from "@graviola/contracts/typechain"
import {
    GraviolaCollection__factory,
    GraviolaCollectionReadProxy__factory,
    GraviolaKeywordsVaultBasic__factory,
} from "@graviola/contracts/typechain"
import { addresses as target } from "@graviola/contracts/addresses"
import type { Card, Keyword } from "@graviola/core"
import { propertiesToCard, wordIdToRarity } from "@graviola/core"
import { reshape2d } from "./utils/reshape2d"

let rpcUrl: string =
    "https://dawn-delicate-breeze.arbitrum-sepolia.quiknode.pro/"

let addresses = target.testnet

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

export const getVaultContract = (): GraviolaKeywordsVaultBasic =>
    GraviolaKeywordsVaultBasic__factory.connect(
        addresses.KEYWORDS_VAULT_ADDRESS,
        provider,
    )

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

    const [ids, availableProperties, values] = owner
        ? await collection.tokenOfOwnerRange(owner, start, end)
        : await collection.tokenRange(start, end)

    const rawPropertyValues = reshape2d(values, availableProperties.length)

    return ids.map((id, i) =>
        propertiesToCard(id, [availableProperties, rawPropertyValues[i]]),
    )
}

export const getKeywords = async (): Promise<Keyword[]> => {
    const vault = getVaultContract()
    const keywords = await vault.getKeywords()
    return keywords.map((keyword, id) => ({
        name: keyword,
        rarity: wordIdToRarity(id),
    }))
}
