import { createAction } from "@reduxjs/toolkit";
import { ICreatedLobbyData } from "../../../services/apiService";
import { IMatchEvent } from "./model";


export interface IJoinLobbyPayload extends ICreatedLobbyData {} ;
export const joinLobby = createAction<IJoinLobbyPayload>('lobbies/joinLobby')
export const deltaTimeUpdate = createAction<number>('lobbies/deltaTimeUpdate')
export const lobbyMatchEventReceived = createAction<IMatchEvent>('lobbies/lobbyMatchEventReceived')
