import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface UserStats {
    tokenBalance: number
    nftsOwned: number
    nftsDropped: number
}

const initialState: UserStats = {
    tokenBalance: 0,
    nftsDropped: 0,
    nftsOwned: 0,
}

export const userStatsSlice = createSlice({
    name: "userStats",
    initialState,
    reducers: {
        setTokenBalance: (state, action: PayloadAction<number>) => {
            state.tokenBalance = action.payload
        },
        setNftsDropped: (state, action: PayloadAction<number>) => {
            state.tokenBalance = action.payload
        },
        setNftsOwned: (state, action: PayloadAction<number>) => {
            state.tokenBalance = action.payload
        },
        setUserStats: (_, action: PayloadAction<UserStats>) => {
            return action.payload
        },
    },
})

export const { setTokenBalance, setNftsDropped, setNftsOwned, setUserStats } =
    userStatsSlice.actions
export default userStatsSlice.reducer
