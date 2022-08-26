import uuid4 from "uuid4";
import { conn } from './client';

const lobbyTableName = "sh_lobby";
const matchTableName = "sh_match";
const matchEventTableName = "sh_match_event";

export interface ISettings {
    secondsPerRound: number,
    bonusSecondsPerWord: number,
    team1words: number,
    team2words: number,
    team0words: number,
    loseWordEnabled: boolean,
}

export interface IMatchEvent {
    lobbyId: string,
    matchId: string,
    type: string,
    data: any,
    timestamp: Date
}

export interface IClueMatchEvent extends IMatchEvent {
    type: "clue",
    data: {
        text: string
    },
}

export interface IGuessMatchEvent extends IMatchEvent {
    type: "guess",
    data: {
        playerId: string,
        word: string
    },
}

export interface IWordSelectedMatchEvent extends IMatchEvent {
    type: "word_selected",
    data: {
        word: string,
        wordTeam: number,
        selectedByTeam: number,
    }
}

export interface IWordsSyncEvent extends IMatchEvent {
    type: "words_sync",
    data: {
        words: IMatchWord[],
    }
}

export interface IPlayerJoinedMatchEvent extends IMatchEvent {
    type: "player_joined",
    data: {
        playerId: string,
        username: string,
        color: string,
        team: number,
        isSpyMaster: boolean,
    }
}

export interface IMatchWord {
    text: string,
    team: number,
}

export interface IPlayer {
    id: string,
    team: number,
    guess: string | null,
    isSpyMaster: boolean
}

export interface ILobbyData {
    id: string,
    settings: ISettings,
    currentMatchId: string,
    hostUserId: string,
    createdAt: Date,
}

export interface IMatch {
    id: string,
    settings: ISettings,
    lobbyId: string,
    createdAt: Date,
    endedAt: Date | null,
    words: IMatchWord[],
    players: IPlayer[],
    events?: IMatchEvent[]
}

export async function insertLobby(lobbyData: ILobbyData) {
    const lobbyRes = await conn.collection(lobbyTableName).insertOne(lobbyData);
    return lobbyRes
}

export async function insertMatch(match: IMatch) {
    const matchRes = await conn.collection(matchTableName).insertOne(match);
    const query = {id: match.lobbyId};
    const lobbyData = {$set: {currentMatchId: match.id}};
    await conn.collection(lobbyTableName).updateOne(query, lobbyData)
    return matchRes;
}

export async function getLobbyData(lobbyId: string) {
    const lobbyData = await conn.collection(lobbyTableName).findOne(
        {id: lobbyId}
    );
    return lobbyData;
}

export async function getMatchData(matchId: string) {
    const matchData = await conn.collection(matchTableName).findOne(
        {id: matchId}
    );
    return matchData;
}

export async function insertMatchEvent(event: IMatchEvent) {
    const res = await conn.collection(matchEventTableName).insertOne(event);
    return event;
}

export async function getMatchEvents(lobbyId: string, matchId: string) {
    const cursor = await conn.collection(matchEventTableName).find(
        {lobbyId: lobbyId, matchId: matchId}
    );
    const res = await cursor.toArray()
    return res;
}
