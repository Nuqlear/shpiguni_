import { hyphenateSync } from "hyphen/ru";
import { IPlayer, IWord } from '../store/entities/lobby/model';
import PlayerColor from "./PlayerColor";
import "./WordCard.css";

interface WordCardProps {
    word: IWord,
    players: IPlayer[]
}

const WordCard = (props: WordCardProps) => {
    const text = hyphenateSync(props.word.text, {minWordLength: 7});
    const teamStyle = `team-${props.word.team}`;

    let classes = "m-2 p-2 word-card unselectable ";
    if (!props.word.isActive) {
        classes += 'word-card-inactive';
    } else {
        classes += teamStyle;
    }

    return (
        <div className={ classes }>
            <span>{ text }</span>
            <div className="word-guess-container w-100 d-flex flex-row-reverse p-2">
                {
                    props.players.map((player) => {
                        return <PlayerColor key={ player.id } player={ player }/>
                    })
                }
            </div>
        </div>
    );
};

export default WordCard;
