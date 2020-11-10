import { GAME_STATE } from 'utilities/constants';
import { toRoot } from 'utilities/router';
import { subscribeToGameUpdatesService } from '@services';
import { GAME_UPDATE } from '@actions/types';

let previousGame;

const subscribeToGameUpdates = (
  gameUid,
  gameFromStorage = null,
  playerUid,
  { dispatch }
) => {
  previousGame = gameFromStorage;

  return new Promise(resolve => {
    subscribeToGameUpdatesService(gameUid, game => {
      if (game) {
        const localRanks = getLocalRanks(game, previousGame, playerUid);

        dispatch({
          type: GAME_UPDATE,
          payload: { game, localRanks }
        });

        previousGame = { ...game };

        resolve();
      } else {
        toRoot()();
      }
    });
  });
};

const getLocalRanks = (game, previousGame, playerUid) => {
  const { state: previousState } = previousGame || {};
  const { state: nextState, topics, guesses } = game;

  // reloading the page during a game
  if (
    (previousState === GAME_STATE.BETWEEN_ROUNDS ||
      previousState === GAME_STATE.STARTED) &&
    nextState === GAME_STATE.RANKING
  ) {
    return defaultLocalRanks(topics);
  }

  // rejoining a game
  if (!previousGame && nextState === GAME_STATE.RANKING) {
    const player = game.players[playerUid];

    if (nextState === GAME_STATE.RANKING && !player.lockedIn) {
      return defaultLocalRanks(topics);
    }

    if (nextState === GAME_STATE.RANKING && player.lockedIn) {
      return lockedInLocalRanks(topics, playerUid, guesses);
    }
  }

  return null;
};

const defaultLocalRanks = topics =>
  activeTopics(topics).reduce(
    (localRanks, topic, index) => ({
      ...localRanks,
      [topic.uid]: index
    }),
    {}
  );

const lockedInLocalRanks = (topics, playerUid, guesses) =>
  activeTopics(topics).reduce(
    (localRanks, topic) => ({
      ...localRanks,
      [topic.uid]: guesses[playerUid][topic.uid]
    }),
    {}
  );

const activeTopics = topics =>
  Object.keys(topics)
    .map(uid => ({ uid, ...topics[uid] }))
    .filter(({ status }) => status === 'active');

export { subscribeToGameUpdates };
