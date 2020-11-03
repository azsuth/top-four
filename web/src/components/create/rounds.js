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
          @harrison &amp; @emily
          <br />
          <br />
          Fill me in!
        </Coachmark>
      </div>
    </div>
  );
}

export default Rounds;
