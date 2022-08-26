import jwt_decode from 'jwt-decode';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiService } from "../../../services/apiService";
import { IUser, IUserData } from "./model";


export const loadUser = createAsyncThunk(
    'loadUser',
    async (): Promise<IUser> => {
        if (!localStorage.jwt) {
            const data = await ApiService.fromConfig().register({});
            localStorage.setItem("jwt", data.jwt);
        }
        const userData = jwt_decode(localStorage.jwt) as IUserData;
        return {
            id: userData.id,
            username: userData.username,
            color: userData.color,
            jwt: localStorage.jwt,
        }
    }
)
