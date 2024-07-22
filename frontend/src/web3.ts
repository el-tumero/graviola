import { isDevMode } from "./app/mode"
import addressesLocal from "../../contracts/addresses-local.json"
import addresses from "../../contracts/addresses.json"
import { JsonRpcProvider, Signer } from "ethers"
import { Graviola__factory } from "../../contracts/typechain-types/factories/GraviolaMain.sol"
import { Graviola } from "../../contracts/typechain-types/GraviolaMain.sol"
import { GraviolaSeasonsGovernor } from "../../contracts/typechain-types/GraviolaSeasonsGovernor"
import { GraviolaSeasonsGovernor__factory } from "../../contracts/typechain-types/factories/GraviolaSeasonsGovernor__factory"

const defaultRpc = isDevMode
    ? import.meta.env.VITE_DEV_RPC
    : "https://sepolia-rollup.arbitrum.io/rpc"
const graviolaAddress = isDevMode
    ? addressesLocal.GRAVIOLA_ADDRESS
    : addresses.GRAVIOLA_ADDRESS
const seasonsGovernorAddress = isDevMode
    ? addressesLocal.SEASONS_GOVERNOR_ADDRESS
    : addresses.SEASONS_GOVERNOR_ADDRESS

let provider = new JsonRpcProvider(defaultRpc)
let graviolaContract: Graviola = Graviola__factory.connect(
    graviolaAddress,
    provider,
)
let seasonsGovernorContract: GraviolaSeasonsGovernor =
    GraviolaSeasonsGovernor__factory.connect(seasonsGovernorAddress, provider)

let signer: Signer | undefined

export function setSigner(s: Signer) {
    signer = s
}

export function connectContractsToSigner() {
    graviolaContract = graviolaContract.connect(signer)
}

export { graviolaContract, seasonsGovernorContract }
