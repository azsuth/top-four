import _ from 'lodash';
import {
  setPlayerLockedInService,
  updateGameService
} from '../services/Game';

import {
  UPDATE_MY_RANKS,
  SHOW_LOCK_IN_DIALOG,
  RESET_LOCAL_RANKING,
  SHOW_REVEAL_DIALOG,
  LOCKED_IN,
  HIDE_REVEAL_DIALOG,
  SKIP_SCORE
} from './types';

export const updateMyRanks = (topics, sourceIndex, destinationIndex) => {
  const reorderedTopics = Array.from(topics);
  const [removed] = reorderedTopics.splice(sourceIndex, 1);
  reorderedTopics.splice(destinationIndex, 0, removed);

  const localRanks = _.reduce(
    reorderedTopics,
    (result, value, index) => ({
      ...result,
      [value.uid]: index
    }),
    {}
  );

  return {
    type: UPDATE_MY_RANKS,
    payload: localRanks
  };
};

export const showLockInDialog = () => ({
  type: SHOW_LOCK_IN_DIALOG,
  payload: true
});

export const hideLockInDialog = () => ({
  type: SHOW_LOCK_IN_DIALOG,
  payload: false
});

const lockedIn = () => ({
  type: LOCKED_IN
});

const showRevealDialog = pendingRevealAction => ({
  type: SHOW_REVEAL_DIALOG,
  payload: pendingRevealAction
});

export const hideRevealDialog = () => ({
  type: HIDE_REVEAL_DIALOG
})

export const lockIn = () => (dispatch, getState) => {
  dispatch(hideLockInDialog());

  const { gameUid, playerUid } = getState().Game;

  setPlayerLockedInService(gameUid, playerUid, true, () => {
    dispatch(lockedIn());
  });
};

export const allPlayersLockedIn = players => {
  return _.filter(players, { lockedIn: true }).length === players.length;
}

export const reveal = (topic, force) => (dispatch, getState) => {
  const { players, topics, gameUid, state } = getState().Game;

  const allLockedIn = allPlayersLockedIn(players.array);

  if (allLockedIn || force || state === 'ranked') {
    if (getState().RankTopics.showRevealDialog) {
      dispatch(hideRevealDialog());
    }

    setRoundRanked(
      { [topic.uid]: getState().RankTopics.localRanks[topic.uid] },
      topics.map,
      gameUid
    );
  } else {
    const pendingRevealAction = () => dispatch(reveal(topic, true));
    dispatch(showRevealDialog(pendingRevealAction));
  }
};

export const revealAll = force => (dispatch, getState) => {
  const { players, topics, gameUid } = getState().Game;

  const allLockedIn = allPlayersLockedIn(players.array);

  if (allLockedIn || force) {
    if (getState().RankTopics.showRevealDialog) {
      dispatch(hideRevealDialog());
    }

    setRoundRanked(getState().RankTopics.localRanks, topics.map, gameUid);
  } else {
    const pendingRevealAction = () => dispatch(revealAll(true));
    dispatch(showRevealDialog(pendingRevealAction));
  }
};

const setRoundRanked = (localRanks, topics, gameUid) => {
  _.forEach(localRanks, (localRank, localUid) => {
    topics[localUid].status = 'ranked';
    topics[localUid].rank = localRank;
  });

  const game = {
    state: 'ranked',
    topics
  };

  updateGameService(game, gameUid);
};

const resetLocalRanking = () => ({
  type: RESET_LOCAL_RANKING
});

export const endRound = () => (dispatch, getState) => {
  const { gameUid, playerUid, topics, players } = getState().Game;

  _.forEach(topics.map, topic => {
    if (topic.status === 'ranked') {
      topic.status = 'unavailable';
    }
  });

  players.map[playerUid].lockedIn = false;

  const game = {
    state: '',
    rankingPlayerUid: '',
    topics: topics.map,
    players: players.map
  };

  dispatch({ type: SKIP_SCORE });
  updateGameService(game, gameUid);
};

export const roundEnded = history => (dispatch, getState) => {
  const { players, gameUid, playerUid } = getState().Game;
  const { roundScore, skipScore } = getState().RankTopics;

  if (skipScore) {
    dispatch(resetLocalRanking());
    history.goBack();
  } else {
    players.map[playerUid].score += roundScore;
    players.map[playerUid].lockedIn = false

    const game = {
      players: players.map
    };

    updateGameService(game, gameUid, () => {
      dispatch(resetLocalRanking());

      history.goBack();
    });
  }
};
