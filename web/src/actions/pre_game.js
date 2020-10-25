import { toTeams, toAddTopics, toGame } from 'utilities/router';

import {
  createGameService,
  getGameUidService,
  addPlayerService,
  joinTeamService,
  addTopicService,
  deleteTopicService,
  unsubscribeFromGameUpdatesService,
  updateGameService
} from '@services';

import { GAME_STATE, TEAMS, WRITE_OUR_OWN_UID } from 'utilities/constants';
import { tagLogger } from 'utilities/logging';

import { subscribeToGameUpdates } from '@actions/subscribe';
import { STARTED_GAME, CLEAR_STATE } from '@actions/types';

const createGame = async (
  { name, gameMode, topicPackUid, numRounds },
  { dispatch, state }
) => {
  const numberOfTeams = gameMode === TEAMS ? 2 : 0;

  const data = await createGameService({
    numberOfTeams,
    topicPackUid: topicPackUid !== WRITE_OUR_OWN_UID ? topicPackUid : null,
    numRounds
  }).catch(tagLogger('createGameService failed'));

  if (!data || !data.gameId || !data.gameUid) {
    return Promise.reject('cannot start game');
  }

  const { gameId, gameUid } = data;

  const playerUid = await addPlayer({ gameUid, name });

  if (!playerUid) {
    return Promise.reject('cannot add player');
  }

  dispatch({
    type: STARTED_GAME,
    payload: { gameId, gameUid, playerUid, name }
  });

  subscribeToGameUpdates(gameUid, null, { dispatch });
};

const joinGame = async ({ name, gameId }, { dispatch }) => {
  const game = await getGameUidService(gameId).catch(
    tagLogger('getGameUidService failed')
  );

  if (!game || !game.gameUid) {
    return Promise.reject('cannot get game object');
  }

  const { gameUid, noTeams, topicPack } = game;

  const playerUid = await addPlayer({ gameUid, name });

  if (!playerUid) {
    return Promise.reject('cannot add player');
  }

  dispatch({
    type: STARTED_GAME,
    payload: { gameId, gameUid, playerUid, name }
  });

  subscribeToGameUpdates(gameUid, null, { dispatch }).then(() => {
    let route;

    if (!noTeams) {
      route = toTeams(gameId);
    } else if (!topicPack) {
      route = toAddTopics(gameId);
    } else {
      route = toGame(gameId);
    }

    route();
  });
};

const addPlayer = async ({ gameUid, name }) => {
  const playerUid = await addPlayerService({ gameUid, name }).catch(
    tagLogger('addPlayerService failed')
  );

  return playerUid;
};

const joinTeam = async (teamUid, { state: { gameUid, playerUid } }) => {
  joinTeamService({ teamUid, playerUid, gameUid });
};

const addTopic = (topic, { state: { gameUid, playerUid } }) => {
  addTopicService({ topic, playerUid, gameUid });
};

const deleteTopic = (topicUid, { state: { gameUid } }) => {
  deleteTopicService(topicUid, gameUid);
};

const clearState = ({ dispatch }) => {
  unsubscribeFromGameUpdatesService();

  dispatch({ type: CLEAR_STATE });
};

const startGame = ({ state: { gameUid } }) => {
  const game = {
    state: GAME_STATE.STARTED
  };

  updateGameService(game, gameUid);
};

export {
  createGame,
  joinGame,
  addPlayer,
  joinTeam,
  addTopic,
  deleteTopic,
  clearState,
  startGame
};
