import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

import { withAction, withState } from '@state';
import { setRankingStartTime } from '@actions';
import { toAllPlayersWithScores } from 'utilities/state_mapping';
import compose from 'utilities/compose';
import { GAME_STATE } from 'utilities/constants';

import Info from 'components/game/info';
import GameTopics from 'components/game/game_topics';
import withGameState from 'components/game/with_game_state';

const Game = ({ gameState, setRankingStartTime }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [topicsTop, setTopicsTop] = useState(null);
  const previousGameState = useRef(gameState && gameState.state);

  useEffect(() => {
    if (gameState) {
      if (
        previousGameState.current === GAME_STATE.BETWEEN_ROUNDS &&
        gameState.state === GAME_STATE.RANKING
      ) {
        setRankingStartTime();
      }
    }

    previousGameState.current = gameState && gameState.state;
  }, [gameState, previousGameState.current]);

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

// actions
const withSetRankingStartTimeAction = withAction(
  setRankingStartTime,
  'setRankingStartTime'
);

const wrappers = compose(
  withPlayerScoresState,
  withPlayerUidState,
  withGameState,
  withSetRankingStartTimeAction
);

export { Game };
export default wrappers(Game);
