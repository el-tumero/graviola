import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type Web3Address = `0x${string}`

interface Web3State {
    address: Web3Address | undefined
    isConnected: boolean
}

const initialState: Web3State = {
    address: undefined,
    isConnected: false,
}

export const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        setConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload
        },
        setAddress: (state, action: PayloadAction<Web3Address>) => {
            state.address = action.payload
        },
    },
})

export const { setConnected, setAddress } = walletSlice.actions

export default walletSlice.reducer
