import { toAddTopics, toGame, toPlayers } from 'utilities/router';

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

import { randomizeTheme } from '@actions';
import { subscribeToGameUpdates } from '@actions/subscribe';
import { STARTED_GAME, CLEAR_STATE } from '@actions/types';

const createGame = async (
  { name, gameMode, topicPackUid, numRounds },
  { dispatch }
) => {
  const numberOfTeams = gameMode === TEAMS ? 2 : 0;

  const data = await createGameService({
    numberOfTeams,
    topicPackUid: topicPackUid !== WRITE_OUR_OWN_UID ? topicPackUid : null,
    numRounds,
    state: topicPackUid !== WRITE_OUR_OWN_UID ? GAME_STATE.BETWEEN_ROUNDS : null
  }).catch(tagLogger('createGameService failed'));

  if (!data || !data.gameId || !data.gameUid) {
    return Promise.reject('cannot start game');
  }

  const { gameId, gameUid } = data;

  const playerUid = await addPlayer({ gameUid, name });

  if (!playerUid) {
    return Promise.reject('cannot add player');
  }

  subscribeToGameUpdates(gameUid, null, playerUid, { dispatch }).then(() => {
    dispatch({
      type: STARTED_GAME,
      payload: { gameId, gameUid, playerUid, name }
    });
  });
};

const joinGame = async ({ name, gameId }, { dispatch }) => {
  const game = await getGameUidService(gameId).catch(
    tagLogger('getGameUidService failed')
  );

  if (!game || !game.gameUid) {
    return Promise.reject({
      field: 'game_id',
      subheader: `The Game ID ${gameId} doesn't exist.`
    });
  }

  const { gameUid, players, started, topicPack } = game;

  const duplicatePlayer = Object.keys(players)
    .map(playerUid => ({
      uid: playerUid,
      ...players[playerUid]
    }))
    .find(player => player.name === name);

  if (!started && duplicatePlayer) {
    return Promise.reject({
      field: 'name',
      subheader: 'Try a different name.',
      msg: `Someone is already playing with the name ${name}!`
    });
  }

  if (started && !duplicatePlayer) {
    return Promise.reject({
      field: 'name',
      subheader: 'This game has already started.',
      msg: 'Rejoining? Enter the same name you started with.'
    });
  }

  let playerUid;

  if (started && duplicatePlayer) {
    playerUid = duplicatePlayer.uid;
  }

  if (!started && !duplicatePlayer) {
    playerUid = await addPlayer({ gameUid, name });
  }

  dispatch({
    type: STARTED_GAME,
    payload: { gameId, gameUid, playerUid, name }
  });

  subscribeToGameUpdates(gameUid, null, playerUid, { dispatch }).then(() => {
    if (started) {
      toGame(gameId)();
    } else {
      if (topicPack) {
        toPlayers(gameId)();
      } else {
        toAddTopics(gameId)();
      }
    }

    randomizeTheme({ dispatch });
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

const addTopic = (
  newTopic,
  {
    state: {
      gameUid,
      playerUid,
      game: { players, topics = {} }
    }
  }
) => {
  return new Promise((resolve, reject) => {
    const duplicateTopic = Object.values(topics).find(
      ({ topic: topicName }) =>
        topicName.toUpperCase().trim() === newTopic.toUpperCase().trim()
    );

    if (duplicateTopic) {
      const playerName = players[duplicateTopic.playerUid].name;

      reject(playerName);
    } else {
      addTopicService({ topic: newTopic, playerUid, gameUid });

      resolve();
    }
  });
};

const deleteTopic = (topicUid, { state: { gameUid } }) => {
  deleteTopicService(topicUid, gameUid);
};

const clearState = ({ dispatch }) => {
  unsubscribeFromGameUpdatesService();

  dispatch({ type: CLEAR_STATE });
};

const startGame = ({ state }) => {
  const game = {
    state: GAME_STATE.STARTED,
    started: true
  };

  updateGameService(game, state.gameUid);
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
