import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query'
import userReducer from "./entities/user/reducers";
import lobbyReducer from "./entities/lobby/reducers";


export const store = configureStore({
  reducer: {
    user: userReducer,
    lobby: lobbyReducer,
  },
})

setupListeners(store.dispatch)


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
