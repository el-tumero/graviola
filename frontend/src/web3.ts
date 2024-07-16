import { isDevMode } from './app/mode'
import addressesLocal from "../../contracts/addresses-local.json"
import addresses from "../../contracts/addresses.json"
import { JsonRpcProvider, Signer } from 'ethers'
import { Graviola__factory } from '../../contracts/typechain-types/factories/GraviolaMain.sol'
import { Graviola } from '../../contracts/typechain-types/GraviolaMain.sol'

console.log(import.meta.env.VITE_DEV_RPC)

const defaultRpc = isDevMode ? import.meta.env.VITE_DEV_RPC : "https://sepolia-rollup.arbitrum.io/rpc"
const graviolaAddress = isDevMode ? addressesLocal.GRAVIOLA_ADDRESS : addresses.GRAVIOLA_ADDRESS

let provider = new JsonRpcProvider(defaultRpc)
let graviolaContract:Graviola = Graviola__factory.connect(graviolaAddress, provider)

let signer:(Signer | undefined)

export function setSigner(s:Signer){
    signer = s
}

export function connectContractsToSigner() {
    graviolaContract = graviolaContract.connect(signer)
}

export {
    graviolaContract
}



