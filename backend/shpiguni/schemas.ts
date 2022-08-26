import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string(),
    color: Joi.string().allow(null),
});
export const createLobbySchema = Joi.object({
    secondsPerRound: Joi.number().integer().greater(0).less(241).required(),
    bonusSecondsPerWord: Joi.number().integer().greater(-1).less(241).required(),
    team1words: Joi.number().integer().required().greater(0).less(24),
    team2words: Joi.number().integer().required().greater(0).less(24),
    team0words: Joi.number().integer().greater(-1).less(24).required(),
    loseWordEnabled: Joi.boolean().required(),
});
