import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiService } from "../../../services/apiService";
import { ICreatedLobbyData } from "../../../services/apiService";
import { ISettings } from "./model";


interface ICreateLobbyArg {
    jwt: string,
    settings: ISettings,
}

export const createLobby = createAsyncThunk(
    'createLobby',
    async (arg: ICreateLobbyArg): Promise<ICreatedLobbyData> => {
        const {jwt, settings} = arg;
        const data = await ApiService.fromConfig(jwt).createLobby(settings);
        return data;
    }
)
