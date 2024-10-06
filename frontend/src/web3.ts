import { isDevMode } from "./utils/mode"
import addressesLocal from "../../contracts/addresses-local.json"
import addressesTestnet from "../../contracts/addresses-testnet.json"
import { WebSocketProvider, Signer } from "ethers"
import {
    GraviolaGenerator,
    GraviolaGenerator__factory,
    GraviolaCollection,
    GraviolaCollection__factory,
    GraviolaToken,
    GraviolaToken__factory,
    GraviolaSeasonsGovernor,
    GraviolaSeasonsGovernor__factory,
    GraviolaSeasonsArchive,
    GraviolaSeasonsArchive__factory,
} from "../../contracts/typechain-types/index"
import { NFT, RawNFTData } from "./types/NFT"
import { gerRarityFromScoreDefault } from "./utils/getRarityFromScore"
import { decodeTokenURI } from "./utils/decodeTokenURI"

const addresses = isDevMode ? addressesLocal : addressesTestnet

const defaultRpc = isDevMode
    ? import.meta.env.VITE_DEV_RPC
    : import.meta.env.VITE_TESTNET_RPC

let provider = new WebSocketProvider(defaultRpc)
let generatorContract: GraviolaGenerator = GraviolaGenerator__factory.connect(
    addresses.GENERATOR_ADDRESS,
    provider,
)
let collectionContract: GraviolaCollection =
    GraviolaCollection__factory.connect(addresses.COLLECTION_ADDRESS, provider)

let tokenContract: GraviolaToken = GraviolaToken__factory.connect(
    addresses.TOKEN_ADDRESS,
    provider,
)

let seasonsGovernorContract: GraviolaSeasonsGovernor =
    GraviolaSeasonsGovernor__factory.connect(
        addresses.SEASONS_GOVERNOR_ADDRESS,
        provider,
    )

let seasonsArchiveContract: GraviolaSeasonsArchive =
    GraviolaSeasonsArchive__factory.connect(
        addresses.SEASONS_ARCHIVE_ADDRESS,
        provider,
    )

let signer: Signer | undefined

export function setSigner(s: Signer) {
    signer = s
}

export function connectContractsToSigner() {
    generatorContract = generatorContract.connect(signer)
    tokenContract = tokenContract.connect(signer)
    seasonsGovernorContract = seasonsGovernorContract.connect(signer)
}

export async function fetchCollection(
    start: number,
    stop: number,
): Promise<NFT[]> {
    const collectionData: NFT[] = []

    const [tokensIds, encoded] = await collectionContract.tokenRange(
        start,
        stop,
    )

    const decoded = encoded.map<RawNFTData>((data) => decodeTokenURI(data))

    for (let i = 0; i < stop - start; i++) {
        const [probability, score, seasonId] = decoded[i].attributes.map(
            (attribute) => attribute.value,
        )

        collectionData.push({
            id: Number(tokensIds[i]),
            description: decoded[i].description,
            image: decoded[i].image,
            rarityGroup: gerRarityFromScoreDefault(score),
            seasonId,
            probability,
            attributes: decoded[i].attributes,
        })
    }

    return collectionData
}

export async function fetchUserCollection(address: string): Promise<NFT[]> {
    const collectionData: NFT[] = []
    const balance = await collectionContract.balanceOf(address)
    if (balance === 0n) return []
    const tokenIds = await collectionContract.tokenOfOwnerRange(
        address,
        0,
        balance,
    )

    for (let i = 0; i < balance; i++) {
        const encoded = await collectionContract.tokenURI(tokenIds[i])
        const decoded = decodeTokenURI(encoded)

        const [probability, score, seasonId] = decoded.attributes.map(
            (attribute) => attribute.value,
        )

        collectionData.push({
            id: Number(tokenIds[i]),
            description: decoded.description,
            image: decoded.image,
            rarityGroup: gerRarityFromScoreDefault(score),
            seasonId,
            probability,
            attributes: decoded.attributes,
        })
    }

    return collectionData
}

export async function fetchGroupSizes(): Promise<number[]> {
    return [77, 15, 5, 2, 1]
}

export async function getBlockNumber() {
    return await provider.getBlockNumber()
}

export {
    generatorContract,
    collectionContract,
    tokenContract,
    seasonsGovernorContract,
    seasonsArchiveContract,
}
