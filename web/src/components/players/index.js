import { h } from 'preact';

import compose from 'utilities/compose';
import { isDesktop } from 'utilities/device';
import { toPlayersWithTopicsCount } from 'utilities/state_mapping';

import { withAction, withState } from '@state';
import { startGame } from '@actions';

import ConfirmButton from 'components/game/confirm_button';
import Logo from 'components/shared/logo';
import IconCircleI from 'components/shared/icon/icon_circle_i';

function topicPackFooter({ isLeadPlayer, leadPlayer, players, startGame }) {
  if (isLeadPlayer) {
    return (
      <ConfirmButton
        confirmText="Start Game"
        confirmAction={() => startGame()}
        disabled={players.length === 1}
        helperText={
          players.length === 1 ? 'Waiting for more players' : 'Everyone here?'
        }
      />
    );
  } else {
    return (
      <>
        <span class="font-weight--bold margin-b--base">Everyone here?</span>
        <span class="color--light-gray">
          Tell {leadPlayer.name} to start the game!
        </span>
      </>
    );
  }
}

function footer({
  isLeadPlayer,
  leadPlayer,
  players,
  remainingPlayers,
  startGame,
  topicPack
}) {
  if (topicPack) {
    return topicPackFooter({ isLeadPlayer, leadPlayer, players, startGame });
  } else {
    if (remainingPlayers.length > 1) {
      return (
        <span class="color--light-gray">
          Waiting on {remainingPlayers.length} player
          {remainingPlayers.length > 1 ? 's' : ''} to enter topics
        </span>
      );
    }

    if (remainingPlayers.length === 1) {
      return (
        <span class="color--light-gray">
          Waiting on {remainingPlayers[0].name} to enter topics.
        </span>
      );
    }

    if (isLeadPlayer) {
      return (
        <ConfirmButton
          confirmText="Start Game"
          confirmAction={() => startGame()}
          disabled={players.length === 1}
          helperText={
            players.length === 1 ? 'Waiting for more players' : 'Everyone here?'
          }
        />
      );
    }

    return (
      <>
        <span class="font-weight--bold margin-b--base">Everyone here?</span>
        <span class="color--light-gray">
          Tell {leadPlayer.name} to start the game!
        </span>
      </>
    );
  }
}

function Players({
  gameId,
  numRounds,
  players,
  playerUid,
  remainingPlayers,
  remainingTotalTopics,
  startGame,
  topicPack
}) {
  if (!players) return null;

  const leadPlayer = players[0];
  const isLeadPlayer = leadPlayer.uid === playerUid;
  const requiredTopics = numRounds * 4;

  return (
    <div class="players flex direction--column align-items--center padding-h--large padding-b--large lg:padding-b--10-vh height--100-pct bg-color--primary">
      <div class="flex-shrink--0 flex justify--center align-items--center margin-t--xlarge lg:margin-t--none lg:height--10-vh padding-h--large width--100-pct lg:max-width--45-pct ">
        <span class="color--white font-weight--bold">{gameId}</span>
        <span class="flex-grow--1 md:flex-grow--0 lg:flex-grow--0 md:margin-h--xlarge lg:margin-h--xlarge">
          <Logo size={isDesktop() ? 'med' : 'small'} />
        </span>
        <span class="visibility--none">
          <IconCircleI />
        </span>
      </div>
      <div class="container flex direction--column align-items--center flex-grow--1 margin-t--large lg:margin-t--none padding-v--large padding-h--s padding-b--s overflow--hidden width--100-pct lg:max-width--45-pct">
        <h1 class="modal-header color--primary-darkest margin-b--base">
          {players.length} Player{players.length > 1 ? 's' : ''}
        </h1>
        <div class="flex-grow--1 flex direction--column padding-h--xlarge overflow-y--auto width--100-pct">
          {players.map((player, index) => (
            <div class="margin-b--base flex font-weight--bold font-size--base">
              <span class="color--primary display--ib margin-r--s">
                {index + 1}.
              </span>
              <span>
                {player.name}{' '}
                {player.uid === playerUid && (
                  <span class="font-weight--normal">(You)</span>
                )}{' '}
                {!topicPack &&
                  player.uid !== playerUid &&
                  player.numTopics < requiredTopics && (
                    <span class="font-weight--normal">{`(${
                      requiredTopics - player.numTopics
                    } more topic${
                      requiredTopics - player.numTopics === 1 ? '' : 's'
                    })`}</span>
                  )}
              </span>
            </div>
          ))}
        </div>
        {footer({
          isLeadPlayer,
          leadPlayer,
          players,
          remainingPlayers,
          remainingTotalTopics,
          startGame,
          topicPack
        })}
      </div>
    </div>
  );
}

// state
const withGameIdState = withState('gameId');
const withPlayersState = withState('game', 'players', toPlayersWithTopicsCount);
const withPlayerUidState = withState('playerUid');
const withTopicPackState = withState('game.topicPack', 'topicPack');
const withNumRoundsState = withState('game.numRounds', 'numRounds');

// actions
const withStartGameAction = withAction(startGame, 'startGame');

const withProps = WrappedComponent => {
  return props => {
    const { numRounds, players, topicPack } = props;

    if (topicPack || !players) {
      return <WrappedComponent {...props} />;
    }

    const remainingPlayers = players.filter(
      ({ numTopics }) => numTopics < numRounds * 4
    );

    return <WrappedComponent {...props} remainingPlayers={remainingPlayers} />;
  };
};

const wrappers = compose(
  withGameIdState,
  withPlayersState,
  withPlayerUidState,
  withTopicPackState,
  withNumRoundsState,
  withStartGameAction,
  withProps
);

export default wrappers(Players);
