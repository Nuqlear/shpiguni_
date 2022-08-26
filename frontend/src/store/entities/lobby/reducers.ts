import {
    createReducer,
} from '@reduxjs/toolkit'
import { ILobby, IWord, IPlayer, IClue, IMatchEvent } from './model'
import {
    createLobby
} from "./thunk";
import { getWords } from '../../../matchEvents';
import { deltaTimeUpdate, joinLobby, lobbyMatchEventReceived } from "./actions";
import { WritableDraft } from 'immer/dist/internal';

interface LobbyState {
    lobby: ILobby,
    isLoading: boolean,
    isCreating: boolean,
    words: {
        list: IWord[],
    },
    players: {
        list: IPlayer[],
        mapping: Map<string, IPlayer>,
    },
    clues: {
        list: IClue[]
    },
    timeLeft: number,
    secondsPerRound: number,
    bonusSecondsPerWord: number,
}

const clues = [
    {
        "team": 1,
        "text": "Хрючево 10"
    },
    {
        "team": 1,
        "text": "Украина 1"
    },
    {
        "team": 1,
        "text": "Секс 3"
    },
    {
        "team": 2,
        "text": "Путин 2"
    },
    {
        "team": 2,
        "text": "Аниме 5"
    },
] as IClue[];

const initialState = {
    isLoading: true,
    isCreating: false,
    words: {
        list: [] as IWord[],
    },
    players: {
        list: [] as IPlayer[],
    },
    clues: {
        list: [] as IClue[]
    },
    timeLeft: 90000,
} as LobbyState

const lobbyReducer = createReducer(
    initialState,
    (builder) => {
        builder
            .addCase(createLobby.pending, (state, action) => {
            state.isLoading = true;
            state.isCreating = true;
        })
        .addCase(deltaTimeUpdate, (state, action) => {
            state.timeLeft -= action.payload
            if (state.timeLeft < 0) {
                state.timeLeft = 0;
            }
        })
        .addCase(joinLobby, (state, action) => {
            const lobbyData = {
                id: action.payload.lobby.id,
                currentMatchId: action.payload.lobby.currentMatchId,
                hostUserId: action.payload.lobby.hostUserId,
                settings: action.payload.lobby.settings,
            }
            state.lobby = lobbyData;
            state.timeLeft = lobbyData.settings.secondsPerRound * 1000;
            state.players.list = [];
            state.clues.list = clues;
            const words = action.payload.match.words.map((w) => {
                return {
                    text: w.text,
                    team: w.team,
                    isActive: true,
                }
            })
            state.words.list = getWords(words, action.payload.match.events);
            state.isLoading = false;
            state.isCreating = false;
        })
        .addCase(lobbyMatchEventReceived, (state, action) => {
            console.log("lobbyMatchEventReceived");
            if (action.payload.type == "player_joined") {
                handlePlayerJoined(state, action.payload)
            } else if (action.payload.type == "words_sync") {
                handleWordsSync(state, action.payload);
            }
        })
    }
)

function handlePlayerJoined(state: WritableDraft<LobbyState>, event: IMatchEvent) {
    state.players.list = state.players.list.filter(
        item => item.id != event.data.playerId
    )
    if (event.data.team > 0) {
        state.players.list.push(
            {
                id: event.data.playerId,
                team: event.data.team,
                guess: null,
                isSpyMaster: event.data.isSpyMaster,
                color: event.data.color,
                username: event.data.username,
            },
        )
    }
}

function handleWordsSync(state: WritableDraft<LobbyState>, event: IMatchEvent) {
    state.words.list = event.data.words.map((w: IWord) => {
        return {
            text: w.text,
            team: w.team,
            isActive: true,
        }
    });
    console.log(event.data.words);
}

export default lobbyReducer;
