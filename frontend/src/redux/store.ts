import { configureStore } from "@reduxjs/toolkit"
import walletReducer from "./reducers/wallet"
import themeReducer from "./reducers/theme"
import graviolaDataReducer from "./reducers/graviola"
import userStatsReducer from "./reducers/stats"

const store = configureStore({
    reducer: {
        graviolaData: graviolaDataReducer,
        wallet: walletReducer,
        theme: themeReducer,
        stats: userStatsReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
