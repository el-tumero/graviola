import { configureStore } from '@reduxjs/toolkit'
import web3Reducer from '../features/wallet/web3Slice'
// import counterReducer from '../features/counter/counterSlice'

const store = configureStore({
  reducer: {
    web3: web3Reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
