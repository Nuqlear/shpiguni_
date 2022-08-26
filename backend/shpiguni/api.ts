import express from "express";
import uuid4 from "uuid4";
import jwt from 'jsonwebtoken'

import config from './config';
import { registerSchema, createLobbySchema } from "./schemas";
import { randomColor, randomName } from "./userGenerator";
import { registerUser } from "./db/user";
import { decodeAuthToken } from "./auth";
import { createLobby } from "./lobby";

const apiRouter = express.Router();

apiRouter.post('/register', async (req, res) => {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        res.status(400).send({status: false, error: error});
        return;
    }
    const id = uuid4().replace(/-/g, '');
    let username = value.username || randomName();
    let color = value.color || randomColor();
    const data = {
        "id": id,
        "username": username,
        "color": color,
    }
    await registerUser(data)
    const token = jwt.sign(data, config.SECRET_KEY);
    res.status(201).send({"jwt": token});
    res.end();
});

apiRouter.post('/lobby/create', async (req, res) => {
    const token = decodeAuthToken(req);
    if (token == null) {
        res.status(401).end();
        return;
    }
    const { error, value } = createLobbySchema.validate(req.body);
    if (error) {
        res.status(400).send({status: false, error: error});
        return;
    }
    const lobby = await createLobby(token.id, value);
    res.status(201).send(lobby);
    res.end();
});

export default apiRouter;
