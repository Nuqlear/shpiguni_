import { io, Socket } from 'socket.io-client';
import { AppDispatch } from '../store/store';
import { joinLobby, lobbyMatchEventReceived } from '../store/entities/lobby/actions';
import { IMatchEvent } from '../matchEvents';
import { IUserData } from './apiService';

export class SocketService {

    socket: Socket
    dispatch: AppDispatch

    constructor(url: string, jwt: string, dispatch: AppDispatch) {
        this.socket = io(url, {
            auth: { token: `Bearer ${jwt}` }
        })
        this.dispatch = dispatch;
    }

    static fromConfig(jwt: string, dispatch: AppDispatch) {
        return new SocketService("http://localhost:3000", jwt, dispatch);
    }

    joinLobby(lobbyId: string) {
        this.socket.emit("joinLobby", lobbyId);

        this.socket.on("lobbyData", (lobbyData) => {
            this.dispatch(joinLobby(lobbyData));
        });

        this.socket.on("lobbyMatchEvent", (eventData: IMatchEvent) => {
            console.log("lobbyMatchEvent");
            this.dispatch(lobbyMatchEventReceived(eventData))
        })
    }

    joinTeam(
        user: IUserData,
        lobbyId: string,
        matchId: string,
        team: number,
        isSpyMaster: boolean,
    ) {
        console.log("emit joinTeam");
        this.socket.emit(
            "joinTeam",
            user,
            lobbyId,
            matchId,
            team,
            isSpyMaster,
        )
    }
}
