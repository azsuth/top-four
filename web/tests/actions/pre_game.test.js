import {
  addPlayerService,
  createGameService,
  getGameUidService,
  addTopicService
} from '@services';

import { subscribeToGameUpdates } from '@actions/subscribe';

jest.mock('@services', () => ({
  addPlayerService: jest.fn(),
  createGameService: jest.fn(),
  getGameUidService: jest.fn(),
  addTopicService: jest.fn()
}));

jest.mock('@actions/subscribe', () => ({
  subscribeToGameUpdates: jest.fn()
}));

import { createGame, addPlayer, joinGame, addTopic } from '@actions/pre_game';

import { STARTED_GAME } from '@actions/types';
import {
  TEAMS,
  INDIVIDUALS,
  WRITE_OUR_OWN_UID,
  GAME_STATE
} from 'utilities/constants';

describe('pre game actions', () => {
  beforeEach(() => {
    addPlayerService.mockRestore();
    createGameService.mockRestore();
    getGameUidService.mockRestore();
    addTopicService.mockRestore();

    subscribeToGameUpdates.mockRestore();
  });

  describe('addPlayer', () => {
    it('calls addPlayerService with the gameUid and name', async () => {
      addPlayerService.mockResolvedValue('12345');
      const player = {
        gameUid: 'qwerty',
        name: 'darth vader'
      };

      const playerUid = await addPlayer(player);

      expect(addPlayerService).toHaveBeenCalledTimes(1);
      expect(addPlayerService.mock.calls[0][0]).toEqual(player);
      expect(playerUid).toBe('12345');
    });
  });

  describe('createGame', () => {
    it('calls createGameService for teams and topic pack', () => {
      createGameService.mockRejectedValue();

      createGame(
        { name: 'andrew', gameMode: TEAMS, topicPackUid: '12345' },
        { state: { topicPacks: [] } }
      ).catch(jest.fn);

      expect(createGameService).toHaveBeenCalledTimes(1);
      expect(createGameService.mock.calls[0][0]).toEqual({
        numberOfTeams: 2,
        topicPackUid: '12345',
        state: GAME_STATE.BETWEEN_ROUNDS
      });
    });

    it('calls createGameService for individuals and no topic pack', () => {
      createGameService.mockRejectedValue();

      createGame(
        {
          name: 'andrew',
          gameMode: INDIVIDUALS,
          topicPackUid: WRITE_OUR_OWN_UID
        },
        { state: { topicPacks: [] } }
      ).catch(jest.fn);

      expect(createGameService).toHaveBeenCalledTimes(1);
      expect(createGameService.mock.calls[0][0]).toEqual({
        numberOfTeams: 0,
        topicPackUid: null,
        state: null
      });
    });

    it('starts a game', async () => {
      createGameService.mockResolvedValue({ gameId: 'A6', gameUid: '12345' });
      addPlayerService.mockResolvedValue('98765');
      subscribeToGameUpdates.mockResolvedValue();

      const dispatch = jest.fn();

      await createGame(
        { name: 'andrew' },
        { dispatch, state: { topicPacks: [] } }
      );

      expect(createGameService).toHaveBeenCalledTimes(1);

      expect(addPlayerService).toHaveBeenCalledTimes(1);
      expect(addPlayerService.mock.calls[0][0]).toEqual({
        gameUid: '12345',
        name: 'andrew'
      });

      expect(dispatch).toHaveBeenCalledTimes(1);

      const dispatchedAction = dispatch.mock.calls[0][0];

      expect(dispatchedAction.type).toBe(STARTED_GAME);
      expect(dispatchedAction.payload).toEqual({
        gameId: 'A6',
        gameUid: '12345',
        playerUid: '98765',
        name: 'andrew'
      });

      expect(subscribeToGameUpdates).toHaveBeenCalledTimes(1);
      expect(subscribeToGameUpdates.mock.calls[0][0]).toBe('12345');
    });

    it('rejects if createGameService fails', () => {
      createGameService.mockRejectedValue();

      expect(createGame({}, {})).rejects.toBe('cannot start game');
    });

    it('rejects if createGameService does not return a game object', () => {
      createGameService.mockResolvedValue('not a game object');

      expect(createGame({}, {})).rejects.toBe('cannot start game');
    });
  });

  describe('joinGame', () => {
    it('joins a game', async () => {
      getGameUidService.mockResolvedValue({
        gameUid: '12345',
        players: { player_1: { name: 'Player 1' } },
        state: ''
      });
      addPlayerService.mockResolvedValue('98765');
      subscribeToGameUpdates.mockResolvedValue();

      const dispatch = jest.fn();

      await joinGame({ gameId: 'A6', name: 'andrew' }, { dispatch });

      expect(getGameUidService).toHaveBeenCalledTimes(1);
      expect(getGameUidService.mock.calls[0][0]).toBe('A6');

      expect(addPlayerService).toHaveBeenCalledTimes(1);
      expect(addPlayerService.mock.calls[0][0]).toEqual({
        gameUid: '12345',
        name: 'andrew'
      });

      expect(dispatch).toHaveBeenCalledTimes(2);

      const dispatchedAction = dispatch.mock.calls[0][0];

      expect(dispatchedAction.type).toBe(STARTED_GAME);
      expect(dispatchedAction.payload).toEqual({
        gameId: 'A6',
        gameUid: '12345',
        playerUid: '98765',
        name: 'andrew'
      });

      expect(subscribeToGameUpdates).toHaveBeenCalledTimes(1);
      expect(subscribeToGameUpdates.mock.calls[0][0]).toBe('12345');
    });

    it('rejoins a game', async () => {
      getGameUidService.mockResolvedValue({
        gameUid: '12345',
        players: { player_1: { name: 'Andrew' } },
        started: true
      });
      subscribeToGameUpdates.mockResolvedValue();

      const dispatch = jest.fn();

      await joinGame({ gameId: 'A6', name: 'Andrew' }, { dispatch });

      expect(getGameUidService).toHaveBeenCalledTimes(1);
      expect(getGameUidService.mock.calls[0][0]).toBe('A6');

      expect(addPlayerService).not.toHaveBeenCalled();

      expect(dispatch).toHaveBeenCalledTimes(2);

      const dispatchedAction = dispatch.mock.calls[0][0];

      expect(dispatchedAction.type).toBe(STARTED_GAME);
      expect(dispatchedAction.payload).toEqual({
        gameId: 'A6',
        gameUid: '12345',
        playerUid: 'player_1',
        name: 'Andrew'
      });

      expect(subscribeToGameUpdates).toHaveBeenCalledTimes(1);
      expect(subscribeToGameUpdates.mock.calls[0][0]).toBe('12345');
    });

    it('rejects if getGameUidService fails', () => {
      getGameUidService.mockRejectedValue();

      expect(joinGame({ gameId: 'A6' }, {})).rejects.toEqual({
        field: 'game_id',
        subheader: `The Game ID A6 doesn't exist.`
      });
    });

    it('rejects if the game has not started and the player name is already taken', () => {
      getGameUidService.mockResolvedValue({
        gameUid: '12345',
        players: { player_1: { name: 'Andrew' } },
        started: false
      });

      expect(joinGame({ name: 'Andrew' }, {})).rejects.toEqual({
        field: 'name',
        subheader: 'Try a different name.',
        msg: 'Someone is already playing with the name Andrew!'
      });
    });

    it('rejects if the game has started and the player name is unique', () => {
      getGameUidService.mockResolvedValue({
        gameUid: '12345',
        players: { player_1: { name: 'Andrew' } },
        started: true
      });

      expect(joinGame({ name: 'Emily' }, {})).rejects.toEqual({
        field: 'name',
        subheader: 'This game has already started.',
        msg: 'Rejoining? Enter the same name you started with.'
      });
    });
  });

  describe('addTopic', () => {
    it('calls addTopicService', async () => {
      await addTopic('road trips', {
        state: { gameUid: '12345', playerUid: 'abcde', game: { topics: {} } }
      });

      expect(addTopicService).toHaveBeenCalledTimes(1);
      expect(addTopicService.mock.calls[0][0]).toEqual({
        topic: 'road trips',
        gameUid: '12345',
        playerUid: 'abcde'
      });
    });

    it('rejects if adding a duplicate topic', () => {
      return expect(
        addTopic('road trips', {
          state: {
            game: {
              players: { abcde: { name: 'Andrew' } },
              topics: { 12345: { playerUid: 'abcde', topic: 'Road trips ' } }
            }
          }
        })
      ).rejects.toBe('Andrew');
    });
  });
});
