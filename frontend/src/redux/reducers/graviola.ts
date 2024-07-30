import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { NFT } from "../../types/NFT";
import { RaritiesData } from "../../types/RarityGroup";

interface GraviolaData {
    collection: NFT[]
    rarities: RaritiesData | null
}

const initialState: GraviolaData = {
    collection: [],
    rarities: null
}

export const graviolaDataSlice = createSlice({
    name: "graviolaData",
    initialState,
    reducers: {
        setCollection: (state, action: PayloadAction<NFT[]>) => {
            state.collection = action.payload
        },
        setRarities: (state, action: PayloadAction<RaritiesData>) => {
            state.rarities = action.payload
        }
    }
})

export const { setCollection, setRarities } = graviolaDataSlice.actions
export default graviolaDataSlice.reducer