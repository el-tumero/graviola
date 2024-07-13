import { configureStore } from '@reduxjs/toolkit'
import walletReducer from '../features/wallet/walletSlice'
// import counterReducer from '../features/counter/counterSlice'

const store = configureStore({
  reducer: {
    wallet: walletReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
