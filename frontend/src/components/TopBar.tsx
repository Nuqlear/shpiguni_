import "./TopBar.css";

interface TopBarProps {
    timeLeft: number,
}

const TopBar = (props: TopBarProps) => {
    const minute = Math.floor(props.timeLeft / 60000);
    const seconds = Math.floor((props.timeLeft % 60000) / 1000);
    let secondsString = ("0" + seconds).slice(-2);

    return (
        <div className="col m-2 top-bar">
            <span>{minute}:{secondsString}</span>
        </div>
    );
};

export default TopBar;
