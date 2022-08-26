import { IPlayer } from '../store/entities/lobby/model';
import PlayerColor from "./PlayerColor";
import "./BottomBar.css";

interface BottomBar {
    players: IPlayer[]
}

const BottomBar = (props: BottomBar) => {

    return (
        <div className="col m-2 timer-bar">
            <span className='timer-bar-text'>
                <span className='p-2 unselectable button'>End turn</span>
                {
                    props.players.map((player) => {
                        return <PlayerColor key={ player.id } player={ player }/>
                    })
                }
            </span>
        </div>
    );
};

export default BottomBar;

