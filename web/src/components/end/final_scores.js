import { h } from 'preact';

import { toAllPlayersWithScores } from 'utilities/state_mapping';
import { withState } from '@state';

function FinalScores({ playerScores }) {
  const players = playerScores.filter(({ active }) => active);

  return (
    <div class="container flex-grow--1 flex direction--column align-items--center margin--large padding-v--large padding-h--s">
      <h1 class="modal-header color--primary-dark margin-b--large">
        Final Scores
      </h1>
      <div class="flex-grow--1 width--100-pct overflow-y--auto padding-h--s">
        {players.map(({ name, score }, index) => (
          <div class="flex justify--between align-items--center font-weight--bold font-size--base height--2">
            <span>
              <span class="color--primary display--ib margin-r--s">
                {index + 1}.
              </span>
              <span>{name}</span>
            </span>
            <span>{score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const withPlayerScoresState = withState(
  'game',
  'playerScores',
  toAllPlayersWithScores
);

export default withPlayerScoresState(FinalScores);
