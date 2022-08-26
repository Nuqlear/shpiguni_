import {
    createReducer,
  } from '@reduxjs/toolkit'
  import { IUser } from './model'
  import {
    loadUser
  } from "./thunk";

interface UserState {
    user: {
        data: IUser,
        isLoading: boolean,
    }
}

const initialState = {
    user: {
        data: {},
        isLoading: true,
    },
} as UserState

const userReducer = createReducer(
    initialState,
    (builder) => {
        builder
            .addCase(loadUser.pending, (state, action) => {
            state.user.isLoading = true;
        })
        .addCase(loadUser.fulfilled, (state, action) => {
            state.user.data = action.payload;
            state.user.isLoading = false;
        })
    }
)

export default userReducer;
