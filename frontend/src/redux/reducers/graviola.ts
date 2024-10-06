import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { NFT } from "../../types/NFT"

interface GraviolaData {
    collection: NFT[]
    userCollection: NFT[] | undefined
    collectionTotalSupply: number
    groupSizes: number[]
    weights: number[]
    keywords: string[]
}

const initialState: GraviolaData = {
    collection: [],
    userCollection: undefined,
    collectionTotalSupply: 0,
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
        setUserCollection: (state, action: PayloadAction<NFT[]>) => {
            state.userCollection = action.payload
        },
        setCollectionTotalSupply: (state, action: PayloadAction<number>) => {
            state.collectionTotalSupply = action.payload
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

export const {
    setCollection,
    setUserCollection,
    setCollectionTotalSupply,
    setGroupSizes,
    setWeights,
    setKeywords,
} = graviolaDataSlice.actions
export default graviolaDataSlice.reducer
