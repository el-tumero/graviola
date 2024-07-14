import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { Graviola } from '../../../../contracts/typechain-types/GraviolaMain.sol'
import { Graviola__factory } from "../../../../contracts/typechain-types/factories/GraviolaMain.sol"
import { JsonRpcProvider, Provider, Signer } from 'ethers'
import addressesLocal from "../../../../contracts/addresses-local.json"
import addresses from "../../../../contracts/addresses.json"
import { isDevMode } from '../../app/mode'



export type Web3Address = `0x${string}`

// const defaultRpc = import.meta.env.VITE_DEV_RPC || "https://sepolia-rollup.arbitrum.io/rpc"

const defaultRpc = isDevMode ? import.meta.env.VITE_DEV_RPC : "https://sepolia-rollup.arbitrum.io/rpc"
const graviolaAddress = isDevMode ? addressesLocal.GRAVIOLA_ADDRESS : addresses.GRAVIOLA_ADDRESS


interface Contracts {
    graviola: Graviola
}

interface Web3State {
  walletAddress: Web3Address | undefined
  isWalletConnected: boolean
  provider: Provider
  signer: Signer | undefined
  contracts: Contracts
}


const provider = new JsonRpcProvider(defaultRpc)

// Define the initial state using that type
const initialState: Web3State = {
    walletAddress: undefined,
    isWalletConnected: false,
    provider: provider,
    signer: undefined,
    contracts: {
        graviola: Graviola__factory.connect(graviolaAddress, provider)
    },
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletConnected: (state, action: PayloadAction<boolean>) => {
        state.isWalletConnected = action.payload
    },
    setWalletAddress: (state, action: PayloadAction<Web3Address>) => {
      state.walletAddress = action.payload
    },
    setSigner: (state, action: PayloadAction<Signer>) => {
        state.signer = action.payload
    },
    connectSignerToContracts: (state) => {
        //@ts-ignore
        state.contracts.graviola = state.contracts.graviola.connect(signer) 
    }
  }
})

export const { setWalletConnected, setWalletAddress, setSigner, connectSignerToContracts} = walletSlice.actions

export default walletSlice.reducer