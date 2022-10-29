import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string(),
    color: Joi.string().allow(null),
});

export const settingsTeamSchema = Joi.object({
    id: Joi.string().required(),
    color: Joi.string().required(),
    wordsNumber: Joi.number().integer().required(),
})

export const createLobbySchema = Joi.object({
    secondsPerRound: Joi.number().integer().greater(0).less(241).required(),
    bonusSecondsPerWord: Joi.number().integer().greater(-1).less(241).required(),
    teams: Joi.array().items(settingsTeamSchema).min(2).max(2),
    loseWordsNumber: Joi.number().integer().greater(-1).less(24).required(),
    neutralWordsNumber: Joi.number().integer().greater(-1).less(24).required(),
});
