import { h } from 'preact';

import cx from 'utilities/cx';

import Coachmark from 'components/shared/coachmark';

function Rounds({ numRounds, setNumRounds }) {
  // const

  const roundClasses = roundNum =>
    cx('border--bottom margin-b--s padding-h--xs padding-b--xxs', {
      'b-color--transparent': roundNum !== numRounds,
      'b-color--primary color--black': roundNum === numRounds
    });

  return (
    <div class="rounds flex-grow--1 width--100-pct flex direction--column align-items--center">
      <h1 class="modal-header color--primary-darkest margin-b--large">
        How many rounds do you want to play?
      </h1>
      <div class="flex-grow--1 flex direction--column align-items--center font-size--xlarge font-weight--bold color--light-gray">
        {[1, 2, 3, 4].map(num => (
          <span class={roundClasses(num)} onClick={() => setNumRounds(num)}>
            {num}
          </span>
        ))}
      </div>
      <div class="align-self--end">
        <Coachmark>
          Each player ranks once per round. The more rounds you choose, the
          longer the game will last.
          <br />
          <br />
          For groups of 2-4, we suggest playing 3-4 rounds. For groups of 5 or
          more, we suggest playing 1-2 rounds.
        </Coachmark>
      </div>
    </div>
  );
}

export default Rounds;
