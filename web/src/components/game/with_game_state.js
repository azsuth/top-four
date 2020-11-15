import { h } from 'preact';

import { withState } from '@state';
import {
  toPlayer,
  toAllActivePlayers,
  toUnlockedInPlayers,
  toActivePlayerTurns
} from 'utilities/state_mapping';
import compose from 'utilities/compose';
import { GAME_STATE } from 'utilities/constants';
import { logErrorMessage } from '@services/logger';

const getGameState = ({
  remoteGameState,
  player,
  rankingPlayerUid,
  unlockedInPlayers,
  players,
  numRounds,
  playerTurns
}) => {
  if (!player) return null;

  const { uid: playerUid, lockedIn } = player;
  const ranker = playerUid === rankingPlayerUid;

  if (
    remoteGameState === GAME_STATE.BETWEEN_ROUNDS ||
    remoteGameState === GAME_STATE.STARTED
  ) {
    const previousRankerPosition = players.findIndex(
      ({ uid }) => uid === rankingPlayerUid
    );
    const previousRanker = players[previousRankerPosition];

    const nextRanker = players[(previousRankerPosition + 1) % players.length];

    if (!nextRanker) {
      logErrorMessage(
        `missing nextRanker. previousRankerPosition: ${previousRankerPosition}, players.length: ${players.length}`
      );
    }

    nextRanker.isThisPlayer = nextRanker && playerUid === nextRanker.uid;

    const nextState =
      previousRanker &&
      previousRankerPosition === players.length - 1 &&
      playerTurns[previousRanker.uid] === numRounds
        ? GAME_STATE.END_GAME
        : GAME_STATE.BETWEEN_ROUNDS;

    return {
      state: nextState,
      ranker,
      unlockedInPlayers,
      nextRanker
    };
  }

  if (remoteGameState === GAME_STATE.RANKING && !lockedIn) {
    return { state: GAME_STATE.RANKING, ranker, unlockedInPlayers };
  }

  if (remoteGameState === GAME_STATE.RANKING && lockedIn) {
    return { state: GAME_STATE.LOCKED_IN, ranker, unlockedInPlayers };
  }
};

const withGameState = WrappedComponent => {
  const Component = props => {
    return <WrappedComponent {...props} gameState={getGameState(props)} />;
  };

  const withRemoteGameState = withState('game.state', 'remoteGameState');
  const withPlayerState = withState(null, 'player', toPlayer);
  const withRankingPlayerUidState = withState(
    'game.rankingPlayerUid',
    'rankingPlayerUid'
  );
  const withUnlockedInPlayersState = withState(
    'game.players',
    'unlockedInPlayers',
    toUnlockedInPlayers
  );
  const withPlayersState = withState(
    'game.players',
    'players',
    toAllActivePlayers
  );
  const withNumRoundsState = withState('game.numRounds', 'numRounds');
  const withPlayerTurnsState = withState(
    'game',
    'playerTurns',
    toActivePlayerTurns
  );

  const wrappers = compose(
    withRemoteGameState,
    withPlayerState,
    withRankingPlayerUidState,
    withUnlockedInPlayersState,
    withPlayersState,
    withNumRoundsState,
    withPlayerTurnsState
  );

  return wrappers(Component);
};

export { getGameState, withGameState };
export default withGameState;
