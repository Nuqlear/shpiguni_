import uuid4 from "uuid4";

import { getRandomWords } from "./db/word";
import { shuffleArray } from "./utils";
import { IPlayerJoinedMatchEvent, ISettings, IWordsSyncEvent } from "./db/lobby";
import { insertLobby, getLobbyData, IMatchWord, getMatchEvents, insertMatch, getMatchData, IMatch, insertMatchEvent } from "./db/lobby";
import { User } from "./db/user";
import {
    TEAM_WORD_EMPTY,
    TEAM_WORD_1,
    TEAM_WORD_2,
    TEAM_WORD_LOSE ,
} from "./constants";


function setWordsTeam(
    words: IMatchWord[],
    settings: ISettings
) {
    const updated = words.map((word, index) => {
        const offset = settings.loseWordEnabled ? 1 : 0;
        let team = TEAM_WORD_EMPTY;
        if (index  == 0 && settings.loseWordEnabled) {
            team = TEAM_WORD_LOSE;
        } else if (index < (settings.team1words + offset)) {
            team = TEAM_WORD_1;
        } else if (index < (settings.team1words + offset + settings.team2words)) {
            team = TEAM_WORD_2;
        }
        return {
            "team": team,
            "text": word.text,
        }
    });
    shuffleArray(updated);
    return updated
}

export async function createLobby(hostUserId: string, settings: ISettings) {
    const id = uuid4().replace(/-/g, '') as string;
    const matchId = uuid4().replace(/-/g, '') as string;
    const total_words = (
        settings.team1words +
        settings.team2words +
        settings.team0words +
        (settings.loseWordEnabled ? 1 : 0)
    );
    const words = await getRandomWords(total_words);
    let MatchWords = setWordsTeam(words, settings);
    const lobbyData = {
        id: id,
        currentMatchId: matchId,
        secondsPerRound: 90,
        bonusSecondsPerWord: 10,
        hostUserId: hostUserId,
        settings: settings,
        createdAt: new Date(),
    }
    let matchData = {
        id: matchId,
        secondsPerRound: lobbyData.secondsPerRound,
        bonusSecondsPerWord: lobbyData.bonusSecondsPerWord,
        lobbyId: id,
        words: MatchWords,
        settings: settings,
        players: [],
        createdAt: new Date(),
        endedAt: null,
    }
    await insertLobby(lobbyData);
    await insertMatch(matchData);
    matchData.words.map((w) => w.team = 0);
    const result = {
        lobby: lobbyData,
        match: {
            ...matchData,
            events: [],
        },
        events: [],
    }
    return result;
}

export async function getLobby(userId: string, lobbyId: string) {
    const lobbyData = await getLobbyData(lobbyId);
    let matchData = await getMatchData(lobbyData.currentMatchId);
    let isSpyMaster = getUserIsSpyMaster(userId, matchData).isSpyMaster;
    if (!isSpyMaster) {
        matchData.words.map((w) => w.team = 0);
    }
    return {
        lobby: lobbyData,
        match: {
            ...matchData,
            events: await getMatchEvents(matchData.lobbyId, matchData.id)
        },
    }
}

export function getUserIsSpyMaster(userId: string, matchData: IMatch) {
    let isSpyMaster = false;
    let team = null;
    matchData.players.map((p) => {
        if (p.id == userId && p.isSpyMaster) {
            isSpyMaster = true;
            team = p.team;
        }
    });
    return {
        isSpyMaster: isSpyMaster,
        team: team,
    }
}

export async function createPlayerJoinedEvent(
    user: User,
    lobbyId: string,
    matchId: string,
    team: number,
    isSpyMaster: boolean,
) {
    console.log("createPlayerJoinedEvent");
    const event = {
        timestamp: new Date(),
        matchId: matchId,
        lobbyId: lobbyId,
        type: "player_joined",
        data: {
            playerId: user.id,
            color: user.color,
            username: user.username,
            team: team,
            isSpyMaster: isSpyMaster,
        }
    } as IPlayerJoinedMatchEvent;
    await insertMatchEvent(event);
    return event;
}

export async function createWordsSyncEvent(
    matchId: string, isSpyMaster: boolean
) {
    let matchData = await getMatchData(matchId);
    console.log("createWordsSyncEvent");
    let words = matchData.words;
    if (isSpyMaster == false) {
        words.map((w) => w.team = 0);
    }
    const event = {
        timestamp: new Date(),
        matchId: matchId,
        lobbyId: matchData.lobbyId,
        type: "words_sync",
        data: {
            words: words
        }
    } as IWordsSyncEvent;
    return event;
}
