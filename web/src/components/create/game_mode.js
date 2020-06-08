import { h } from 'preact';
import { FormControlLabel, RadioGroup, Radio } from '@material-ui/core';

import { INDIVIDUALS, TEAMS } from 'utilities/constants';

import Coachmark from 'components/shared/coachmark';

const GameMode = ({ gameMode, setGameMode }) => {
  return (
    <div class="game-mode">
      <div class="game-mode__header">
        <span class="game-mode__header--title">How do you want to play?</span>
        <div class="game-mode__header--coachmark">
          <Coachmark eventLabel="game_mode">
            Confused on what to choose?
            <br />
            <br />
            We recommend playing as individuals if you’re not in the same
            location.
            <br />
            <br />
            We recommend playing as teams if you are in the same location and
            are playing with 6 or more people.
          </Coachmark>
        </div>
      </div>
      <div class="game-mode__choices">
        <RadioGroup
          value={gameMode}
          onChange={({ target: { value } }) => setGameMode(value)}
        >
          <FormControlLabel
            value={TEAMS}
            control={<Radio disabled />}
            label="As teams (coming soon!)"
          />
          <FormControlLabel
            value={INDIVIDUALS}
            control={<Radio />}
            label="As individuals"
          />
        </RadioGroup>
      </div>
    </div>
  );
};

export default GameMode;
