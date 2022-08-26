import TeamScore from './TeamScore';
import { IPlayer, IClue } from '../store/entities/lobby/model';
import PlayerColor from './PlayerColor';
import "./TeamList.css"
import { SocketService } from '../services/socketService';
import { IUser } from '../store/entities/user/model';


interface TeamListProps {
    user: IUser
    players: IPlayer[],
    matchId: string,
    lobbyId: string,
    team: number,
    score: number,
    clues: IClue[],
    socket: SocketService | null
}


const TeamList = (props: TeamListProps) => {
    const teamStyle = `team-${props.team}`;
    const operatives = props.players.filter((player) => {
        return !player.isSpyMaster
    });
    const spyMasters = props.players.filter((player) => {
        return player.isSpyMaster
    });

    return (
        <div className={"p-4 m-4 col team-list " + teamStyle}>
            <div>
                { spyMasters.length
                    ? <p><span className='p-2'>{ spyMasters[0].username }</span></p>
                    : <p
                        className='team-join p-2 button'
                        onClick={ () => props.socket?.joinTeam(
                            props.user,
                            props.lobbyId,
                            props.matchId,
                            props.team,
                            true,
                        )}
                        >
                        Join as spymaster
                    </p>
                }
                <hr/>
                {
                    operatives.map((player) => {
                        return (
                            <p key={ player.id }>
                                <PlayerColor player={ player }/>
                                <span className='p-2'>{ player.username }</span>
                            </p>
                        );
                    })
                }
            </div>
            <TeamScore team={ props.team } score={ props.score }/>
            <div className='team-clues'>
                <p className='team-join p-2 button'
                    onClick={ () => props.socket?.joinTeam(
                        props.user,
                        props.lobbyId,
                        props.matchId,
                        props.team,
                        false,
                    )}
                    >
                    Join as operative
                </p>
                <hr/>
                {
                    props.clues.map((clue) => {
                        return <p key={ clue.text }>{ clue.text }</p>
                    })
                }
            </div>
        </div>
    );
};

export default TeamList;
