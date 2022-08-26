import { IWord } from "./store/entities/lobby/model"

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

export interface IPlayerJoinedMatchEvent extends IMatchEvent {
    type: "player_joined",
    data: {
        playerId: string,
        team: number,
        isSpyMaster: boolean,
    }
}

export function getWords(curWords: IWord[], events: IMatchEvent[]) {
    let words: Map<string, IWord> = new Map();
    curWords.map(w => {
        words.set(w.text, {
            text: w.text,
            team: w.team,
            isActive: true,
        })
    })
    events.map(event => {
        if (event.type == "word_selected") {
            let word = words.get(event.data.word);
            if (!word) {
                return
            }
            word.isActive = false;
            word.team = event.data.wordTeam;
            words.set(event.data.word, word);
        }
    });
    return Array.from(words.values());
}

