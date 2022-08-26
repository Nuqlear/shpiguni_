import axios from "axios";
import { IMatchEvent } from "../matchEvents";
import { ISettings } from "../store/entities/lobby/model";

export interface IUserData {
    username?: string,
    color?: string,
}

export interface IUserRegisterData {
    jwt: string
}

export interface ILobbyWordData {
    text: string,
    team: number,
}

export interface ILobbyPlayerData {
    id: string,
    team: number,
    username: string,
    guess: string | null,
    color: string,
    isSpyMaster: boolean
}

export interface ICreatedLobbyData {
    lobby: {
        id: string,
        currentMatchId: string,
        hostUserId: string,
        settings: ISettings
    },
    match: {
        id: string,
        players: ILobbyPlayerData[],
        words: ILobbyWordData[],
        events: IMatchEvent[],
        settings: ISettings
    },
}

export class ApiService {
    baseUrl: string;
    jwt?: string;

    constructor(baseUrl: string, jwt?: string) {
        this.baseUrl = baseUrl;
        this.jwt = jwt;
    }

    static fromConfig(jwt?: string) {
        return new ApiService("http://localhost:3000", jwt);
    }

    async register(data: IUserData) {
        let config = {
            method: 'post',
            url: `${this.baseUrl}/api/register`,
            data: data,
        }
        const response = await axios(config);
        return response.data as IUserRegisterData;
    }

    async createLobby(settings: ISettings) {
        const config = {
            method: 'post',
            url: `${this.baseUrl}/api/lobby/create`,
            headers: {},
            data: settings,
        }
        if (this.jwt) {
            config["headers"] = {
                "Authorization": this.jwt
            };
        }
        const response = await axios(config);
        return response.data as ICreatedLobbyData;
    }
}
