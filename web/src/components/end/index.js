import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import SwipeableViews from 'react-swipeable-views';

import compose from 'utilities/compose';
import cx from 'utilities/cx';
import { GAME_STATE } from 'utilities/constants';
import { toAllActivePlayers } from 'utilities/state_mapping';
import generateSuperlatives from 'utilities/superlatives';

import { withAction, withState } from '@state';
import { playAnotherRound, revealWinner } from '@actions';

import Button from 'components/shared/button';
import Logo from 'components/shared/logo';

import Superlative from 'components/end/superlative';
import FinalScores from 'components/end/final_scores';
import NewGame from 'components/end/new_game';

function End({
  gameData,
  gameState,
  isLeadPlayer,
  leadPlayer,
  playAnotherRound,
  revealWinner
}) {
  const [step, setStep] = useState(0);
  const superlatives = generateSuperlatives(gameData);

  useEffect(() => {
    if (gameState === GAME_STATE.WINNERS_REVEALED) {
      setStep(1);
    }
  }, [gameState]);

  return (
    <div class="end flex direction--column height--100-pct bg-color--primary">
      <div class="margin-t--xlarge">
        <Logo size="small" />
      </div>
      <SwipeableViews
        containerStyle={{ flexGrow: 1 }}
        disabled
        index={step}
        slideStyle={{ display: 'flex', flexDirection: 'column' }}
        style={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}
      >
        <div class="container flex direction--column align-items--center margin--large padding-v--large">
          <div class="flex direction--column align-items--center width--66-pct">
            <h1 class="modal-header color--primary-dark margin-b--large">
              The End
            </h1>
            {isLeadPlayer && (
              <>
                <Button fullWidth onClick={() => revealWinner()}>
                  Reveal the Winner
                </Button>
                <span class="font-size--base font-weight--bold margin-v--s">
                  or
                </span>
                <Button fullWidth onClick={() => playAnotherRound()}>
                  Play Another Round
                </Button>
              </>
            )}
            {!isLeadPlayer && (
              <span class="font-weight--bold text-align--center margin-b--large">
                Waiting on {leadPlayer.name} to reveal the winner...
              </span>
            )}
          </div>
        </div>
        {superlatives.map(superlative => (
          <Superlative superlative={superlative} />
        ))}
        <FinalScores />
        <NewGame />
      </SwipeableViews>
      {gameState === GAME_STATE.WINNERS_REVEALED && (
        <div class="flex justify--between margin-h--large margin-b--large">
          <div class={cx({ 'visibility--hidden': step === 1 })}>
            <Button
              variant="text-invert"
              onClick={() => setStep(prevStep => prevStep - 1)}
            >
              &lt; Back
            </Button>
          </div>
          <div
            class={cx({
              'visibility--hidden': step === 2 + superlatives.length
            })}
          >
            <Button
              variant="text-invert"
              onClick={() => setStep(prevStep => prevStep + 1)}
            >
              Next &gt;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// state
const withPlayersState = withState(
  'game.players',
  'players',
  toAllActivePlayers
);
const withPlayerUidState = withState('playerUid');
const withGameState = withState('game.state', 'gameState');
const withGameData = withState('game', 'gameData');

// actions
const withRevealWinnerAction = withAction(revealWinner, 'revealWinner');
const withPlayAnotherRoundAction = withAction(
  playAnotherRound,
  'playAnotherRound'
);

const withProps = WrappedComponent => {
  return props => {
    const { players, playerUid } = props;

    const leadPlayer = players[0];
    const isLeadPlayer = leadPlayer.uid === playerUid;

    return (
      <WrappedComponent
        {...props}
        isLeadPlayer={isLeadPlayer}
        leadPlayer={leadPlayer}
      />
    );
  };
};

const wrappers = compose(
  withPlayersState,
  withPlayerUidState,
  withGameState,
  withGameData,
  withRevealWinnerAction,
  withPlayAnotherRoundAction,
  withProps
);

export default wrappers(End);
