import { h } from 'preact';
import compose from 'utilities/compose';

import { withAction } from '@state';
import { startRound, lockIn, endGame } from '@actions';

import { footerContentForState } from 'components/game/game_state_helpers';

const Footer = ({ gameState, startRound, lockIn, endGame }) => {
  return footerContentForState({
    gameState,
    startRound,
    lockIn,
    endGame
  });
};

// actions
const withStartRoundAction = withAction(startRound, 'startRound');
const withLockInAction = withAction(lockIn, 'lockIn');
const withEndGameAction = withAction(endGame, 'endGame');

const wrappers = compose(
  withStartRoundAction,
  withLockInAction,
  withEndGameAction
);

export { Footer };
export default wrappers(Footer);
