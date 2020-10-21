import sampleSize from 'lodash/sampleSize';

import {
  updateGameService,
  lockInService,
  setPlayerActiveService
} from '@services';
import { UPDATE_LOCAL_RANKS } from '@actions/types';

const startRound = ({
  state: {
    playerUid,
    gameUid,
    game: { topics, players }
  }
}) => {
  const game = {
    rankingPlayerUid: playerUid,
    state: 'ranking',
    topics: { ...topics },
    players: { ...players }
  };

  // mark all players not locked in
  Object.keys(players).forEach(uid => (game.players[uid].lockedIn = false));

  // update all ranked topics to unavailable
  Object.keys(topics)
    .map(uid => ({ uid, ...topics[uid] }))
    .filter(({ status }) => status === 'ranked')
    .map(({ uid }) => uid)
    .forEach(uid => {
      game.topics[uid].status = 'unavailable';
    });

  // mark 4 random topics as active
  sampleSize(
    Object.keys(topics)
      .map(uid => ({ uid, ...topics[uid] }))
      .filter(({ status }) => status === 'available'),
    4
  )
    .map(({ uid }) => uid)
    .forEach(uid => {
      game.topics[uid].status = 'active';
    });

  updateGameService(game, gameUid);
};

const updateLocalRanks = (
  activeTopics,
  sourceIndex,
  destinationIndex,
  { dispatch }
) => {
  const reorderedTopics = [...activeTopics];
  const [removed] = reorderedTopics.splice(sourceIndex, 1);
  reorderedTopics.splice(destinationIndex, 0, removed);

  const newRanks = reorderedTopics.reduce(
    (localRanks, topic, index) => ({
      ...localRanks,
      [topic.uid]: index
    }),
    {}
  );

  dispatch({
    type: UPDATE_LOCAL_RANKS,
    payload: newRanks
  });
};

const lockIn = ({
  state: {
    gameUid,
    playerUid,
    localRanks,
    game: { rankingPlayerUid }
  }
}) => {
  const active = playerUid === rankingPlayerUid;
  const guesses = Object.keys(localRanks).reduce(
    (topicGuesses, topicUid) => ({
      ...topicGuesses,
      [topicUid]: active ? 'active' : localRanks[topicUid]
    }),
    {}
  );

  lockInService({ gameUid, playerUid, guesses });
};

const revealTopic = (
  topicUid,
  {
    state: {
      gameUid,
      localRanks,
      game: { topics, state: currentState }
    }
  }
) => {
  const fullyRanked =
    Object.keys(topics)
      .map(uid => ({ uid, ...topics[uid] }))
      .filter(({ status }) => status === 'ranked').length === 3;

  const game = {
    topics: {
      ...topics,
      [topicUid]: {
        ...topics[topicUid],
        rank: localRanks[topicUid],
        status: 'ranked'
      }
    },
    state: fullyRanked ? '' : currentState
  };

  updateGameService(game, gameUid);
};

const togglePlayerActive = (
  playerUid,
  {
    state: {
      gameUid,
      game: { players }
    }
  }
) => {
  const currentlyActive = players[playerUid].active;

  setPlayerActiveService(playerUid, !currentlyActive, gameUid);
};

export {
  startRound,
  updateLocalRanks,
  lockIn,
  revealTopic,
  togglePlayerActive
};
