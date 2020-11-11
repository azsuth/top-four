import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

import { withState } from '@state';
import { toAllPlayersWithScores } from 'utilities/state_mapping';
import compose from 'utilities/compose';
import { GAME_STATE } from 'utilities/constants';

import Info from 'components/game/info';
import GameTopics from 'components/game/game_topics';
import withGameState from 'components/game/with_game_state';

const Game = ({ gameState }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [topicsTop, setTopicsTop] = useState(null);

  if (!gameState) return null;

  return (
    <div class="game height--100-pct">
      <Info
        setTopicsTop={setTopicsTop}
        showInfo={showInfo}
        toggleShowInfo={() => setShowInfo(show => !show)}
        topicsTop={topicsTop}
      />
      <GameTopics
        gameState={gameState}
        hideInfo={() => setShowInfo(false)}
        showInfo={showInfo}
        topicsTop={topicsTop}
      />
    </div>
  );
};

// state
const withPlayerScoresState = withState(
  'game',
  'playerScores',
  toAllPlayersWithScores
);
const withPlayerUidState = withState('playerUid');

const withProps = WrappedComponent => {
  return props => {
    const { playerUid, playerScores } = props;

    const players = playerScores.filter(({ active }) => active);

    let winner;
    if (players.length > 1 && players[0].score === players[1].score) {
      winner = `There's a tie!`;
    } else if (players[0].uid === playerUid) {
      winner = `You're winning!`;
    } else {
      winner = `${players[0].name} is winning!`;
    }

    return <WrappedComponent {...props} winner={winner} />;
  };
};

const withEffect = WrappedComponent => {
  return props => {
    const {
      gameState: { state }
    } = props;

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const mounted = useRef(false);

    useEffect(() => {
      if (!mounted.current) {
        mounted.current = true;
        return;
      }

      if (state === GAME_STATE.BETWEEN_ROUNDS) {
        setTimeout(() => {
          setSnackbarOpen(true);
        }, 2000);
      }
    }, [state]);

    return (
      <WrappedComponent
        {...props}
        closeSnackbar={() => setSnackbarOpen(false)}
        snackbarOpen={snackbarOpen}
      />
    );
  };
};

const wrappers = compose(
  withPlayerScoresState,
  withPlayerUidState,
  withGameState
);

export { Game };
export default wrappers(Game);
