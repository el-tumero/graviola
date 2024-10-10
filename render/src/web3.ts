import { JsonRpcProvider } from "ethers"
import type { GraviolaCollection } from "../../contracts/typechain-types"
import { GraviolaCollection__factory } from "../../contracts/typechain-types/index"
import addresses from "../../contracts/addresses-testnet.json"
import type { Card } from "./types/Card"

const rpcUrl = "https://dawn-delicate-breeze.arbitrum-sepolia.quiknode.pro/"

const provider = new JsonRpcProvider(rpcUrl)

export const getCollection: () => GraviolaCollection = () => {
    return GraviolaCollection__factory.connect(
        addresses.COLLECTION_ADDRESS,
        provider,
    )
}

export const getCards: () => Promise<Card[]> = async () => {
    const collection = getCollection()

    const [ids, rawData] = await collection.tokenRange(0, 5)

    const data = rawData.map((raw, i) => ({
        id: ids[i],
        ...JSON.parse(Buffer.from(raw.slice(29), "base64url").toString()),
    }))

    return data.map((card) => ({
        ...card,
        image: `https://gateway.pinata.cloud/ipfs/${card.image}`,
    }))
}
