import { useParams } from 'react-router-dom';

import WordsBoard from './WordsBoard';
import TeamList from './TeamList';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import LobbySettings from './LobbySettings';
import { useAppDispatch, useAppSelector } from "../reactExt/hooks";
import "./Lobby.css"
import { useState, useEffect } from 'react';
import { SocketService } from '../services/socketService';


const filterByTeam = (team: number) => {
    const lambda = (item: any) => { return (item.team == team) };
    return lambda;
}

const Lobby = () => {
    const { lobbyId: lobbyId } = useParams<{ lobbyId: string | string }>();
    const dispatch = useAppDispatch();
    const userStore = useAppSelector((state) => state.user);
    const lobbyStore = useAppSelector((state) => state.lobby);

    let [socket, setSocket] = useState<SocketService | null>(null);
    useEffect(() => {
        if (!socket && !userStore.user.isLoading && lobbyId) {
            const sock = SocketService.fromConfig(userStore.user.data.jwt, dispatch);
            setSocket(sock);
            sock.joinLobby(lobbyId);
        }
    }, [userStore.user.data.jwt])

    let userIsHost = false;
    let userIsSpyMaster = false;
    if (!userStore.user.isLoading && !lobbyStore.isLoading) {
        userIsHost = userStore.user.data.id === lobbyStore.lobby.hostUserId;
        lobbyStore.players.list.map((p) => {
            if (p.isSpyMaster && p.id == userStore.user.data.id) {
                userIsSpyMaster = true;
            }
        })
    } else {
        return <></>
    }

    const team1Filter = filterByTeam(1);
    const team2Filter = filterByTeam(2);
    let team1Players = lobbyStore.players.list.filter(team1Filter);
    let team2Players = lobbyStore.players.list.filter(team2Filter);
    let team1Clues = lobbyStore.clues.list.filter(team1Filter);
    let team2Clues = lobbyStore.clues.list.filter(team2Filter);
    let teamWords = lobbyStore.words.list.filter((w) => { return w.isActive });
    let team1score = teamWords.filter(team1Filter).length;
    let team2score = teamWords.filter(team2Filter).length;

    return (
        <div className='container-fluid vh-100 vw-100'>
            <div className='row h-100'>
                <TeamList
                    players={ team1Players }
                    team={ 1 }
                    score={ team1score }
                    clues={ team1Clues }
                    socket={ socket }
                    lobbyId={ lobbyStore.lobby.id }
                    matchId={ lobbyStore.lobby.currentMatchId }
                    user={ userStore.user.data }
                    />
                <div className='col'>
                    <div className='row'>
                        <TopBar timeLeft={ lobbyStore.timeLeft }/>
                    </div>
                    <div className='row board-container'>
                        <WordsBoard words={ lobbyStore.words.list } players={ lobbyStore.players.list }/>
                    </div>
                    <div className='row'>
                        <BottomBar players={ team1Players } />
                    </div>
                </div>
                <TeamList
                    players={ team2Players }
                    team={ 2 }
                    score={ team2score }
                    clues={ team2Clues }
                    socket={ socket }
                    lobbyId={ lobbyStore.lobby.id }
                    matchId={ lobbyStore.lobby.currentMatchId }
                    user={ userStore.user.data }
                    />
            </div>
            <LobbySettings/>
        </div>
    );
};

export default Lobby;
