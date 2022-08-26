import { IPlayer } from '../store/entities/lobby/model';
import "./PlayerColor.css";

interface PlayerColorProps {
    player: IPlayer
}

const PlayerColor = (props: PlayerColorProps) => {
    const style = {
        backgroundColor: props.player.color
    };

    return (
        <span className="player-color" style={ style }></span>
    );
};

export default PlayerColor;
