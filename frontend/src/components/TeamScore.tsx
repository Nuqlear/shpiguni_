
import "./TeamScore.css";

interface TeamScoreProps {
    team: number,
    score: number,
}

const TeamScore = (props: TeamScoreProps) => {
    return (
        <div className={"team-score unselectable"}>
            { props.score }
        </div>
    );
};

export default TeamScore;
