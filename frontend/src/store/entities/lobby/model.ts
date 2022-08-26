export interface IWord {
    text: string,
    team: number,
    isActive: boolean
};

export interface ISettings {
    secondsPerRound: number,
    bonusSecondsPerWord: number,
    team1words: number,
    team2words: number,
    team0words: number,
    loseWordEnabled: boolean,
}

export interface IPlayer {
    id: string,
    team: number,
    username: string,
    guess: string | null,
    color: string,
    isSpyMaster: boolean
}

export interface ILobby {
    id: string,
    currentMatchId: string,
    hostUserId: string,
    settings: ISettings,
}

export interface IClue {
    team: number,
    text: string
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

export interface IWordsUpdatedEvent extends IMatchEvent {
    type: "words_updated",
    data: {
        words: IWord[],
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
