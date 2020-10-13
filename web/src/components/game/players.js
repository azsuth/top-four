import { h } from 'preact';
import { useState } from 'preact/hooks';

import compose from 'utilities/compose';
import { toAllPlayersWithScores } from 'utilities/state_mapping';

import { withAction, withState } from '@state';
import { togglePlayerActive } from '@actions';

import Button from 'components/shared/button';

function Players({ playerScores, playerUid, togglePlayerActive }) {
  const [editing, setEditing] = useState(false);

  const players = editing
    ? playerScores
    : playerScores.filter(({ active }) => active);

  return (
    <div class="players flex-grow--1 container flex direction--column align-items--center margin--base padding--large overflow--hidden">
      <h1 class="modal-header color--primary-dark">Scoreboard</h1>
      <div class="flex-grow--1 width--100-pct margin-t--s overflow-y--auto">
        {players.map(({ uid, name, score, active }, index) => (
          <div class="flex justify--between align-items--center font-weight--bold font-size--base height--2">
            <span>
              <span class="color--primary display--ib margin-r--s">
                {index + 1}.
              </span>
              <span>{name}</span>
            </span>
            {editing && (
              <Button
                disabled={uid === playerUid}
                onClick={() => togglePlayerActive(uid)}
                variant="text"
              >
                {active ? 'Deactivate' : 'Activate'}
              </Button>
            )}
            {!editing && <span>{score}</span>}
          </div>
        ))}
      </div>
      <div class="margin-t--s width--15">
        <Button fullWidth onClick={() => setEditing(val => !val)}>
          {editing ? 'Done Editing' : 'Edit Players'}
        </Button>
      </div>
    </div>
  );
}

// state
const withPlayerScoresState = withState(
  'game',
  'playerScores',
  toAllPlayersWithScores
);
const withPlayerUidState = withState('playerUid');

// actions
const withTogglePlayerActiveAction = withAction(
  togglePlayerActive,
  'togglePlayerActive'
);

const wrappers = compose(
  withPlayerScoresState,
  withPlayerUidState,
  withTogglePlayerActiveAction
);

export default wrappers(Players);
