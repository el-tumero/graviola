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

const addresses = isDevMode ? addressesLocal : addressesTestnet

const defaultRpc = isDevMode
    ? import.meta.env.VITE_DEV_RPC
    : "https://sepolia-rollup.arbitrum.io/rpc"

const tokenAddress = isDevMode
    ? addressesLocal.TOKEN_ADDRESS
    : addresses.TOKEN_ADDRESS

let provider = new JsonRpcProvider(defaultRpc)
let generator: GraviolaGenerator = GraviolaGenerator__factory.connect(
    addresses.GENERATOR,
    provider,
)
let collection: GraviolaCollection = GraviolaCollection__factory.connect(
    addresses.COLLECTION,
    provider,
)

let token: GraviolaToken = GraviolaToken__factory.connect(
    addresses.TOKEN,
    provider,
)

let seasonsGovernor: GraviolaSeasonsGovernor =
    GraviolaSeasonsGovernor__factory.connect(
        addresses.SEASONS_GOVERNOR,
        provider,
    )

let seasonsArchive: GraviolaSeasonsArchive =
    GraviolaSeasonsArchive__factory.connect(addresses.SEASONS_ARCHIVE, provider)

let tokenContract: GraviolaToken = GraviolaToken__factory.connect(
    tokenAddress,
    provider,
)

let signer: Signer | undefined

export function setSigner(s: Signer) {
    signer = s
}

export function connectContractsToSigner() {
    generator = generator.connect(signer)
    token = token.connect(signer)
}

export { generator, collection, token, seasonsGovernor, seasonsArchive }
