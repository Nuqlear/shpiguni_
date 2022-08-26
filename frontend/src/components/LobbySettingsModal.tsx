// import "./LobbySettings.css";
import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface LobbySettingsModalProps {
    onCreate: Function,
    onClose: Function,
    isOpen: boolean
}

const LobbySettingsModal = (props: LobbySettingsModalProps) => {
    const [secondsPerRound, setSecondsPerRound] = useState<number>(90);
    const [bonusSecondsPerWord, setBonusSecondsPerWord] = useState<number>(10);
    const [team0number, setTeam0number] = useState<number>(5);
    const [team1number, setTeam1number] = useState<number>(5);
    const [team2number, setTeam2number] = useState<number>(5);
    const [instantLoseWord, setInstantLoseWord] = useState<boolean>(true);

    return (
        <Modal isOpen={ props.isOpen } centered={ true }>
            <ModalHeader>
                Lobby Settings
            </ModalHeader>
            <ModalBody>
                <div>
                    <label htmlFor="secondsPerRound" className="form-label">{ secondsPerRound } Seconds Per Round</label>
                    <input type="range" className="form-range" min="30" max="240" id="secondsPerRound"
                    value={ secondsPerRound }
                    onChange={ (e) => {
                        setSecondsPerRound(parseInt(e.target.value))
                    }}
                    />
                </div>
                <div>
                    <label htmlFor="bonusSecondsPerWord" className="form-label">{ bonusSecondsPerWord } Seconds Added After Successful Guess</label>
                    <input type="range" className="form-range" min="0" max="90" id="bonusSecondsPerWord"
                    value={ bonusSecondsPerWord }
                    onChange={ (e) => {
                        setBonusSecondsPerWord(parseInt(e.target.value))
                    }}
                    />
                </div>
                <div>
                    <label htmlFor="team0number" className="form-label">{ team0number } Neutral Words</label>
                    <input type="range" className="form-range" min="0" max="15" id="team0number"
                    value={ team0number }
                    onChange={ (e) => {
                        setTeam0number(parseInt(e.target.value))
                    }}
                    />
                </div>
                <div>
                    <label htmlFor="team1number" className="form-label">{ team1number } Team #1 Words</label>
                    <input type="range" className="form-range" min="1" max="15" id="team1number"
                    value={ team1number }
                    onChange={ (e) => {
                        setTeam1number(parseInt(e.target.value))
                    }}
                    />
                </div>
                <div>
                    <label htmlFor="team2number" className="form-label">{ team2number } Team #2 Words</label>
                    <input type="range" className="form-range" min="1" max="15" id="team2number"
                    value={ team2number }
                    onChange={ (e) => {
                        setTeam2number(parseInt(e.target.value))
                    }}
                    />
                </div>
                <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"
                    checked={ instantLoseWord }
                    onChange={ (e) => setInstantLoseWord(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                    Instant Lose Word
                    </label>
                </div>
            </ModalBody>
            <ModalFooter>
                <button
                    type="button"
                    className="btn btn-seconday"
                    data-dismiss="modal"
                    onClick={() => props.onClose() }
                    >
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={ () => props.onCreate(
                        {
                            secondsPerRound: secondsPerRound,
                            bonusSecondsPerWord: bonusSecondsPerWord,
                            team0words: team0number,
                            team1words: team1number,
                            team2words: team2number,
                            loseWordEnabled: instantLoseWord,
                        }
                    ) }
                    >
                    Create
                </button>
            </ModalFooter>
        </Modal>
    );
};

export default LobbySettingsModal;

