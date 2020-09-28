import {
  addPlayerService,
  startGameService,
  getGameUidService,
  addTopicService
} from '@services';

import { subscribeToGameUpdates } from '@actions/subscribe';

import { toTeams } from 'utilities/router';

jest.mock('@services', () => ({
  addPlayerService: jest.fn(),
  startGameService: jest.fn(),
  getGameUidService: jest.fn(),
  addTopicService: jest.fn()
}));

jest.mock('@actions/subscribe', () => ({
  subscribeToGameUpdates: jest.fn()
}));

jest.mock('utilities/router', () => ({
  toTeams: jest.fn()
}));

import { startGame, addPlayer, joinGame, addTopic } from '@actions/pre_game';

import { STARTED_GAME } from '@actions/types';
import { TEAMS, INDIVIDUALS, WRITE_OUR_OWN_UID } from 'utilities/constants';

describe('pre game actions', () => {
  beforeEach(() => {
    addPlayerService.mockRestore();
    startGameService.mockRestore();
    getGameUidService.mockRestore();
    addTopicService.mockRestore();

    subscribeToGameUpdates.mockRestore();

    toTeams.mockRestore();
    toTeams.mockReturnValue(() => {});
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

  describe('startGame', () => {
    it('calls startGameService for teams and topic pack', () => {
      startGameService.mockRejectedValue();

      startGame(
        { name: 'andrew', gameMode: TEAMS, topicPackUid: '12345' },
        { state: { topicPacks: [] } }
      ).catch(jest.fn);

      expect(startGameService).toHaveBeenCalledTimes(1);
      expect(startGameService.mock.calls[0][0]).toEqual({
        numberOfTeams: 2,
        topicPackUid: '12345'
      });
    });

    it('calls startGameService for individuals and no topic pack', () => {
      startGameService.mockRejectedValue();

      startGame(
        {
          name: 'andrew',
          gameMode: INDIVIDUALS,
          topicPackUid: WRITE_OUR_OWN_UID
        },
        { state: { topicPacks: [] } }
      ).catch(jest.fn);

      expect(startGameService).toHaveBeenCalledTimes(1);
      expect(startGameService.mock.calls[0][0]).toEqual({
        numberOfTeams: 0,
        topicPackUid: null
      });
    });

    it('starts a game', async () => {
      startGameService.mockResolvedValue({ gameId: 'A6', gameUid: '12345' });
      addPlayerService.mockResolvedValue('98765');
      subscribeToGameUpdates.mockResolvedValue();

      const dispatch = jest.fn();

      await startGame(
        { name: 'andrew' },
        { dispatch, state: { topicPacks: [] } }
      );

      expect(startGameService).toHaveBeenCalledTimes(1);

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

    it('rejects if startGameService fails', () => {
      startGameService.mockRejectedValue();

      expect(startGame({}, {})).rejects.toBe('cannot start game');
    });

    it('rejects if startGameService does not return a game object', () => {
      startGameService.mockResolvedValue('not a game object');

      expect(startGame({}, {})).rejects.toBe('cannot start game');
    });

    it('rejects if addPlayerService fails', () => {
      startGameService.mockResolvedValue({ gameId: 'A6', gameUid: '12345' });
      addPlayerService.mockRejectedValue();

      expect(startGame({}, {})).rejects.toBe('cannot add player');
    });
  });

  describe('joinGame', () => {
    it('joins a game', async () => {
      getGameUidService.mockResolvedValue({ gameUid: '12345' });
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

      expect(toTeams).toHaveBeenCalledTimes(1);
      expect(toTeams.mock.calls[0][0]).toBe('A6');
    });

    it('rejects if getGameUidService fails', () => {
      getGameUidService.mockRejectedValue();

      expect(joinGame({}, {})).rejects.toBe('cannot get game object');
    });

    it('rejects if getGameUidService does not return a game object', () => {
      getGameUidService.mockResolvedValue('not a game object');

      expect(joinGame({}, {})).rejects.toBe('cannot get game object');
    });

    it('rejects if addPlayerService fails', () => {
      getGameUidService.mockResolvedValue({ gameUid: '12345 ' });
      addPlayerService.mockRejectedValue();

      expect(joinGame({}, {})).rejects.toBe('cannot add player');
    });
  });

  describe('addTopic', () => {
    it('calls addTopicService', () => {
      addTopic('road trips', {
        state: { gameUid: '12345', playerUid: 'abcde' }
      });

      expect(addTopicService).toHaveBeenCalledTimes(1);
      expect(addTopicService.mock.calls[0][0]).toEqual({
        topic: 'road trips',
        gameUid: '12345',
        playerUid: 'abcde'
      });
    });
  });
});
