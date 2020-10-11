import { h } from 'preact';

import { withState } from '@state';
import {
  toPlayer,
  toAllActivePlayers,
  toUnlockedInPlayers,
  availableTopicsToCount
} from 'utilities/state_mapping';
import compose from 'utilities/compose';
import { GAME_STATE } from 'utilities/constants';

const getGameState = ({
  remoteGameState,
  player,
  rankingPlayerUid,
  unlockedInPlayers,
  players,
  availableTopicsCount
}) => {
  const { uid: playerUid, lockedIn } = player;
  const ranker = playerUid === rankingPlayerUid;

  if (!remoteGameState) {
    const currentRankerPosition = players.findIndex(
      ({ uid }) => uid === rankingPlayerUid
    );
    const nextRanker = players[(currentRankerPosition + 1) % players.length];

    nextRanker.isThisPlayer = nextRanker && playerUid === nextRanker.uid;

    return {
      state: GAME_STATE.BETWEEN_ROUNDS,
      ranker,
      unlockedInPlayers,
      nextRanker,
      availableTopicsCount
    };
  }

  if (remoteGameState === 'ranking' && !lockedIn)
    return { state: GAME_STATE.RANKING, ranker, unlockedInPlayers };

  if (remoteGameState === 'ranking' && lockedIn)
    return { state: GAME_STATE.LOCKED_IN, ranker, unlockedInPlayers };
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
  const withAvailableTopicsCountState = withState(
    'game.topics',
    'availableTopicsCount',
    availableTopicsToCount
  );

  const wrappers = compose(
    withRemoteGameState,
    withPlayerState,
    withRankingPlayerUidState,
    withUnlockedInPlayersState,
    withPlayersState,
    withAvailableTopicsCountState
  );

  return wrappers(Component);
};

export { getGameState, withGameState };
export default withGameState;
