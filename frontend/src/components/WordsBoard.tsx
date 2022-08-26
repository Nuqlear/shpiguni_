import WordCard from "./WordCard";
import "./WordsBoard.css"
import { IPlayer, IWord } from '../store/entities/lobby/model';


interface WordsBoardProps {
    players: IPlayer[],
    words: IWord[]
}

const WordsBoard = (props: WordsBoardProps) => {
    const widthPerColumn = 160.8;
    const maxWidth = Math.floor(Math.sqrt(props.words.length));
    const style = {maxWidth: Math.floor(widthPerColumn * maxWidth) + 'px'};
    return (
        <div className="d-flex flex-wrap align-content-start board" style={ style }>
            {
                props.words.map((word) => {
                    return <WordCard players={ props.players.filter(
                        (player) => {
                            return player.guess == word.text
                        }
                    )} word={ word } key={ word.text } />
                })
            }
        </div>
    );
};

export default WordsBoard;
