import { Socket } from "socket.io";
import { User } from "./db/user";
import { getLobby } from "./lobby";
import { createPlayerJoinedEvent, createWordsSyncEvent } from "./lobby";


declare module 'socket.io' {
    interface Socket extends ExtendedSocket {}
}

interface ExtendedSocket {
    encodedToken?: string
    decodedToken?: any
    user?: any
}

const socketListeners = (io: any) => {
    io.on("connection", async (socket: Socket) => {
        const userId = socket.decodedToken.id;

        socket.on("joinLobby", async (lobbyId: string) => {
            const lobbyData = await getLobby(userId, lobbyId);
            socket.emit('lobbyData', lobbyData);
            socket.join(`lobbies/${lobbyId}`);
        })

        socket.on("joinTeam", async (
            user: User,
            lobbyId: string,
            matchId: string,
            teamId: string,
            isSpyMaster: boolean,
        ) => {
            console.log("got joinTeam event");
            const event = await createPlayerJoinedEvent(
                user,
                lobbyId,
                matchId,
                teamId,
                isSpyMaster,
            );
            socket.data.lobbyId = lobbyId;
            socket.data.matchId = matchId;
            io.to(`lobbies/${lobbyId}`).emit("lobbyMatchEvent", event);
            const syncEvent = await createWordsSyncEvent(
                matchId, isSpyMaster,
            );
            socket.emit("lobbyMatchEvent", syncEvent);
        })

        socket.on("disconnect", async () => {
            console.log("disconnect");
            if (!(socket.data.lobbyId && socket.data.matchId)) {
                return
            }
            const event = await createPlayerJoinedEvent(
                {
                    id: socket.decodedToken.id,
                    username: socket.decodedToken.username,
                    color: socket.decodedToken.color,
                },
                socket.data.lobbyId,
                socket.data.matchId,
                "-1",
                false,
            );
            io.to(`lobbies/${socket.data.lobbyId}`).emit("lobbyMatchEvent", event);
        })
    })
};

export default socketListeners
