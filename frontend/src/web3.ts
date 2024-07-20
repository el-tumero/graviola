import { isDevMode } from './app/mode'
import addressesLocal from "../../contracts/addresses-local.json"
import addresses from "../../contracts/addresses.json"
import localhostConfig from "../../contracts/localhost-config.json"
import { JsonRpcProvider, Signer } from 'ethers'
import { Graviola__factory } from '../../contracts/typechain-types/factories/GraviolaMain.sol'
import { Graviola } from '../../contracts/typechain-types/GraviolaMain.sol'

const defaultRpc = isDevMode ? localhostConfig.rpcUrl : "https://sepolia-rollup.arbitrum.io/rpc"
const graviolaAddress = isDevMode ? addressesLocal.GRAVIOLA_ADDRESS : addresses.GRAVIOLA_ADDRESS

console.log("====")
console.log("isDevMode ", isDevMode)
console.log("GraviolaAddress ", graviolaAddress)
console.log("====")

let provider = new JsonRpcProvider(defaultRpc)
let graviolaContract: Graviola = Graviola__factory.connect(graviolaAddress, provider)

let signer: (Signer | undefined)

export function setSigner(s: Signer) {
    signer = s
}

export function connectContractsToSigner() {
    graviolaContract = graviolaContract.connect(signer)
}

export {
    graviolaContract
}



