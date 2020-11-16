import { h } from 'preact';

import { INDIVIDUALS, TEAMS } from 'utilities/constants';

import Coachmark from 'components/shared/coachmark';
import RadioInput from 'components/shared/radio_input';

const GameMode = ({ gameMode, setGameMode }) => {
  return (
    <div class="game-mode flex-grow--1 width--100-pct flex direction--column align-items--center">
      <h1 class="modal-header color--primary-darkest margin-b--large">
        How do you want to play?
      </h1>
      <div class="flex-grow--1">
        <div class="margin-b--large">
          <RadioInput
            checked={gameMode === INDIVIDUALS}
            label="As individuals"
            name={INDIVIDUALS}
            onChange={() => setGameMode(INDIVIDUALS)}
            value={INDIVIDUALS}
          />
        </div>
        <RadioInput
          checked={gameMode === TEAMS}
          disabled
          label="As teams (coming soon!)"
          name={TEAMS}
          onChange={() => setGameMode(TEAMS)}
          value={TEAMS}
        />
      </div>
      <div class="align-self--end">
        <Coachmark name="game-mode">
          Confused on what to choose?
          <br />
          <br />
          We recommend playing as individuals if you’re not in the same
          location.
          <br />
          <br />
          We recommend playing as teams if you are in the same location and are
          playing with 6 or more people.
        </Coachmark>
      </div>
    </div>
  );
};

export default GameMode;
