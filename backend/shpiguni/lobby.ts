import uuid4 from "uuid4";

import { getRandomWords } from "./db/word";
import { shuffleArray } from "./utils";
import { IPlayerJoinedMatchEvent, ISettings, ITeam, IWordsSyncEvent } from "./db/lobby";
import { insertLobby, getLobbyData, IMatchWord, getMatchEvents, insertMatch, getMatchData, IMatch, insertMatchEvent } from "./db/lobby";
import { User } from "./db/user";
import { TEAM_WORD_EMPTY, TEAM_WORD_LOSE } from "./constants";


function setWordsTeam(
    words: IMatchWord[],
    settings: ISettings
) {
    const updated = words.map((word, index) => {
        const loseOffset = settings.loseWordsNumber;
        const emptyOffset = (loseOffset + settings.neutralWordsNumber);
        let teamId = null;
        if (index < loseOffset) {
            teamId = TEAM_WORD_LOSE;
        } else if (index < emptyOffset) {
            teamId = TEAM_WORD_EMPTY;
        } else {
            let curIdx = emptyOffset;
            settings.teams.forEach((teamSettings) => {
                if (index < curIdx + teamSettings.wordsNumber) {
                    teamId = teamSettings.id
                }
                curIdx += teamSettings.wordsNumber;
            });
        }
        return {
            "teamId": teamId,
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
        settings.teams.reduce((sum: number, team: ITeam) => sum + team.wordsNumber, 0) +
        settings.neutralWordsNumber +
        settings.loseWordsNumber
    );
    const words = await getRandomWords(total_words);
    let MatchWords = setWordsTeam(words, settings);
    const lobbyData = {
        id: id,
        currentMatchId: matchId,
        hostUserId: hostUserId,
        settings: settings,
        createdAt: new Date(),
    }
    let matchData = {
        id: matchId,
        lobbyId: id,
        words: MatchWords,
        settings: settings,
        players: [],
        createdAt: new Date(),
        endedAt: null,
    }
    await insertLobby(lobbyData);
    await insertMatch(matchData);
    matchData.words.map((w) => w.teamId = 0);
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
        matchData.words.map((w) => w.teamId = 0);
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
    let teamId = null;
    matchData.players.map((p) => {
        if (p.id == userId && p.isSpyMaster) {
            isSpyMaster = true;
            teamId = p.teamId;
        }
    });
    return {
        isSpyMaster: isSpyMaster,
        teamId: teamId,
    }
}

export async function createPlayerJoinedEvent(
    user: User,
    lobbyId: string,
    matchId: string,
    teamId: string,
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
            teamId: teamId,
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
        words.map((w) => w.teamId = 0);
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
