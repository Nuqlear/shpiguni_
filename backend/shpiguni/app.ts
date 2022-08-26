import express from "express";
import http from "http";
import { Server } from "socket.io";
import { authorize } from "@thream/socketio-jwt";

import config from "./config";
import apiRouter from "./api";
import socketListeners from "./socket";
import { connect } from "./db/client";
import { insertWords } from "./db/word";

const app = express();

app.use(express.json());
app.use('/api', apiRouter);

const server = http.createServer(app);

const io = new Server(server, { /* options */ });
io.use(
    authorize({
        secret: config.SECRET_KEY
    })
)
socketListeners(io);


connect().then(() => {
    // insertWords().then(() => {
    //     server.listen(config.PORT, () => {
    //         console.log(`listening on *:${config.PORT}`);
    //     });
    // })
    server.listen(config.PORT, () => {
        console.log(`listening on *:${config.PORT}`);
    });
})

