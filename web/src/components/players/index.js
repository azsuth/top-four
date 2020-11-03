import { h } from 'preact';

import compose from 'utilities/compose';
import { toAllActivePlayers } from 'utilities/state_mapping';

import { withAction, withState } from '@state';
import { startGame } from '@actions';

import ConfirmButton from 'components/game/confirm_button';
import Logo from 'components/shared/logo';
import IconCircleI from 'components/shared/icon/icon_circle_i';

function Players({ gameId, players, playerUid, startGame }) {
  const leadPlayer = players[0];
  const isLeadPLayer = leadPlayer.uid === playerUid;

  return (
    <div class="players flex direction--column height--100-pct bg-color--primary">
      <div class="flex-shrink--0 flex align-items--center margin-t--xlarge padding-h--base">
        <span class="color--white font-weight--bold">{gameId}</span>
        <span class="flex-grow--1">
          <Logo size="small" />
        </span>
        <span class="visibility--none">
          <IconCircleI />
        </span>
      </div>
      <div class="container flex direction--column align-items--center flex-grow--1 margin--large padding-v--large padding-b--s overflow--hidden">
        <h1 class="modal-header color--primary-darkest margin-b--base">
          {players.length} Player{players.length > 1 ? 's' : ''}
        </h1>
        <div class="flex-grow--1 flex direction--column padding-h--base overflow-y--auto width--100-pct">
          {players.map((player, index) => (
            <div class="margin-b--base flex align-items--center font-weight--bold font-size--base">
              <span class="color--primary display--ib margin-r--s">
                {index + 1}.
              </span>
              <span>
                {player.name}{' '}
                {player.uid === playerUid && (
                  <span class="font-weight--normal">(You)</span>
                )}
              </span>
            </div>
          ))}
        </div>
        {isLeadPLayer && (
          <ConfirmButton
            confirmText="Start Game"
            confirmAction={() => startGame()}
            disabled={players.length === 1}
            helperText={
              players.length === 1
                ? 'Waiting for more players'
                : 'Everyone here?'
            }
          />
        )}
        {!isLeadPLayer && (
          <>
            <span class="font-weight--bold margin-b--base">Everyone here?</span>
            <span class="color--light-gray">
              Tell {leadPlayer.name} to start the game!
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// state
const withGameIdState = withState('gameId');
const withPlayersState = withState(
  'game.players',
  'players',
  toAllActivePlayers
);
const withPlayerUidState = withState('playerUid');

// actions
const withStartGameAction = withAction(startGame, 'startGame');

const wrappers = compose(
  withGameIdState,
  withPlayersState,
  withPlayerUidState,
  withStartGameAction
);

export default wrappers(Players);
