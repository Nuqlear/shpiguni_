import { useNavigate } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";

import "./EntryPoint.css";
import { useAppDispatch, useAppSelector } from "../reactExt/hooks";
import { createLobby } from '../store/entities/lobby/thunk';
import LobbySettingsModal from './LobbySettingsModal';
import { useState } from "react";
import { ISettings } from "../store/entities/lobby/model";


const EntryPoint = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const userStore = useAppSelector((state) => state.user);
    const lobbyStore = useAppSelector((state) => state.lobby);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const userIsLoading = userStore.user.isLoading;
    const lobbyIsLoading = lobbyStore.isCreating;

    const closeModal = () => {
        setModalIsOpen(false);
    }

    const create = (settings: ISettings) => {
        closeModal();
        dispatch(createLobby({jwt: userStore.user.data.jwt, settings: settings}))
            .then(unwrapResult)
            .then((response) => {
                const lobbyId = response.lobby.id;
                navigate(`/lobby/${lobbyId}`);
            })
    }

    return (
        <div className="vw-100 entry-point">
            <h1>shpiguni</h1>
            <button
                onClick={() => { setModalIsOpen(true) }}
                disabled={ userIsLoading || lobbyIsLoading }>
                Create Lobby
            </button>
            <LobbySettingsModal
                isOpen={ modalIsOpen }
                onCreate={ create }
                onClose={ closeModal }
                />
        </div>
    );
};

export default EntryPoint;
