export interface IWord {
    text: string,
    teamId: string,
    isActive: boolean
};

export interface ITeam {
    id: string,
    color: string,
    wordsNumber: number,
}

export interface ISettings {
    secondsPerRound: number,
    bonusSecondsPerWord: number,
    teams: ITeam[],
    neutralWordsNumber: number,
    loseWordsNumber: number,
}

export interface IPlayer {
    id: string,
    teamId: string,
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
    teamId: string,
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
        wordTeamId: string,
        selectedByTeamId: string,
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
        teamId: string,
        isSpyMaster: boolean,
    }
}
