import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { NFT } from "../../types/NFT"

interface GraviolaData {
    collection: NFT[]
    groupSizes: number[]
    weights: number[]
    keywords: string[]
}

const initialState: GraviolaData = {
    collection: [],
    groupSizes: [],
    weights: [],
    keywords: [],
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
        setKeywords: (state, action: PayloadAction<string[]>) => {
            state.keywords = action.payload
        },
    },
})

export const { setCollection, setGroupSizes, setWeights, setKeywords } =
    graviolaDataSlice.actions
export default graviolaDataSlice.reducer
