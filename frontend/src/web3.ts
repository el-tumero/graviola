import { isDevMode } from "./utils/mode"
import addressesLocal from "../../contracts/addresses-local.json"
import addressesTestnet from "../../contracts/addresses-testnet.json"
import { JsonRpcProvider, Signer } from "ethers"
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
import { atob } from "buffer"
import { NFT } from "./types/NFT"

const addresses = isDevMode ? addressesLocal : addressesTestnet

const defaultRpc = isDevMode
    ? import.meta.env.VITE_DEV_RPC
    : "https://sepolia-rollup.arbitrum.io/rpc"

let provider = new JsonRpcProvider(defaultRpc)
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
}

export async function fetchCollection(): Promise<NFT[]> {
    const totalSupply = await collectionContract.totalSupply()
    const collectionData = []
    for (let i = 0; i < totalSupply; i++) {
        const encoded = await collectionContract.tokenURI(i)
        const decoded = atob(encoded)
        collectionData.push(JSON.parse(decoded))
    }
    return collectionData
}

export async function fetchGroupSizes(): Promise<number[]> {
    const groupSizes = await seasonsArchiveContract.getGroupSizes()
    return groupSizes.map((size: bigint) => Number(size))
}

export {
    generatorContract,
    collectionContract,
    tokenContract,
    seasonsGovernorContract,
    seasonsArchiveContract,
}
