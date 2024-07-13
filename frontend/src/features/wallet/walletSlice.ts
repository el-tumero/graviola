import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

// Define a type for the slice state
interface WalletState {
  isConnected: boolean
}

// Define the initial state using that type
const initialState: WalletState = {
    isConnected: false,
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setConnectedTrue: (state) => {
        state.isConnected = true
    },
    setConnectedFalse: (state) => {
        state.isConnected = false
    }
  },
})

export const { setConnectedTrue, setConnectedFalse } = walletSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectWallet = (state: RootState) => state.wallet.isConnected

export default walletSlice.reducer