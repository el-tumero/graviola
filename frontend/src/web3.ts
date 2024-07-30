import { isDevMode } from "./utils/mode"
import addressesLocal from "../../contracts/addresses-local.json"
import addresses from "../../contracts/addresses.json"
import { JsonRpcProvider, Signer } from "ethers"
import {
    Graviola,
    Graviola__factory,
    GraviolaSeasonsGovernor,
    GraviolaSeasonsGovernor__factory,
    GraviolaToken,
    GraviolaToken__factory,
} from "../../contracts/typechain-types/index"

const defaultRpc = isDevMode
    ? import.meta.env.VITE_DEV_RPC
    : "https://sepolia-rollup.arbitrum.io/rpc"
const graviolaAddress = isDevMode
    ? addressesLocal.GRAVIOLA_ADDRESS
    : addresses.GRAVIOLA_ADDRESS
const seasonsGovernorAddress = isDevMode
    ? addressesLocal.SEASONS_GOVERNOR_ADDRESS
    : addresses.SEASONS_GOVERNOR_ADDRESS

const tokenAddress = isDevMode
    ? addressesLocal.TOKEN_ADDRESS
    : addresses.TOKEN_ADDRESS

let provider = new JsonRpcProvider(defaultRpc)
let graviolaContract: Graviola = Graviola__factory.connect(
    graviolaAddress,
    provider,
)
let seasonsGovernorContract: GraviolaSeasonsGovernor =
    GraviolaSeasonsGovernor__factory.connect(seasonsGovernorAddress, provider)

let tokenContract: GraviolaToken = GraviolaToken__factory.connect(tokenAddress, provider)

let signer: Signer | undefined

export function setSigner(s: Signer) {
    signer = s
}

export function connectContractsToSigner() {
    graviolaContract = graviolaContract.connect(signer)
}

export { graviolaContract, seasonsGovernorContract, tokenContract }
