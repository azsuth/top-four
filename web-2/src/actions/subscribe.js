import { toRoot } from 'utilities/router';
import { subscribeToGameUpdatesService } from '@services';
import { GAME_UPDATE } from '@actions/types';

let previousGame;

const subscribeToGameUpdates = (gameUid, { dispatch }) => {
  previousGame = null;

  return new Promise(resolve => {
    subscribeToGameUpdatesService(gameUid, game => {
      if (game) {
        const localRanks = getLocalRanks(game, previousGame);

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

const getLocalRanks = (game, previousGame) => {
  const { state: previousState } = previousGame || {};
  const { state: nextState, topics } = game;

  if (!previousState && nextState === 'ranking') {
    return defaultLocalRanks(topics);
  }

  return null;
};

const defaultLocalRanks = topics =>
  Object.keys(topics)
    .map(uid => ({ uid, ...topics[uid] }))
    .filter(({ status }) => status === 'active')
    .reduce(
      (localRanks, topic, index) => ({
        ...localRanks,
        [topic.uid]: index
      }),
      {}
    );

export { subscribeToGameUpdates };
