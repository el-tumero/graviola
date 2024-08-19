import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { NFT } from "../../types/NFT"

interface GraviolaData {
    collection: NFT[]
    groupSizes: number[]
    weights: number[]
}

const initialState: GraviolaData = {
    collection: [],
    groupSizes: [],
    weights: [],
}

export const graviolaDataSlice = createSlice({
    name: "graviolaData",
    initialState,
    reducers: {
        setCollection: (state, action: PayloadAction<NFT[]>) => {
            state.collection = action.payload
        },
        setGroupSizes: (state, action: PayloadAction<number[]>) => {
            state.groupSizes = action.payload
        },
        setWeights: (state, action: PayloadAction<number[]>) => {
            state.weights = action.payload
        },
    },
})

export const { setCollection, setGroupSizes, setWeights } =
    graviolaDataSlice.actions
export default graviolaDataSlice.reducer
