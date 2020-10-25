import { GAME_STATE } from 'utilities/constants';
import {
  updateGameService,
  lockInService,
  setPlayerActiveService
} from '@services';

jest.mock('@services', () => ({
  updateGameService: jest.fn(),
  lockInService: jest.fn(),
  setPlayerActiveService: jest.fn()
}));

import {
  startRound,
  updateLocalRanks,
  lockIn,
  revealTopic,
  togglePlayerActive
} from '@actions/in_game';

import { UPDATE_LOCAL_RANKS } from '@actions/types';

describe('in game actions', () => {
  beforeEach(() => {
    updateGameService.mockRestore();
    lockInService.mockRestore();
    setPlayerActiveService.mockRestore();
  });

  describe('startRound', () => {
    it('calls updateGameService', () => {
      const topics = {
        12345: { status: 'available' },
        23456: { status: 'unavailable' },
        34567: { status: 'available' },
        45678: { status: 'available' },
        56789: { status: 'available' },
        67890: { status: 'available' },
        78901: { status: 'ranked' },
        89012: { status: 'ranked' }
      };

      startRound({
        state: {
          playerUid: 'abcde',
          gameUid: '98765',
          game: {
            topics,
            players: {
              98765: { lockedIn: true },
              87654: { lockedIn: true }
            }
          }
        }
      });

      expect(updateGameService).toHaveBeenCalledTimes(1);
      expect(updateGameService.mock.calls[0][1]).toBe('98765');

      const game = updateGameService.mock.calls[0][0];
      const gameTopics = Object.keys(game.topics).map(uid => ({
        uid,
        ...game.topics[uid]
      }));

      expect(game.rankingPlayerUid).toBe('abcde');
      expect(game.state).toBe('ranking');
      expect(
        gameTopics.filter(({ status }) => status === 'active').length
      ).toBe(4);
      expect(game.players['98765'].lockedIn).toBe(false);
      expect(game.players['87654'].lockedIn).toBe(false);
    });
  });

  describe('updateLocalRanks', () => {
    it('reorders the sorted active topics', () => {
      const dispatch = jest.fn();
      const activeTopics = [
        { uid: '12345', name: 'topic a' },
        { uid: '23456', name: 'topic b' },
        { uid: '34567', name: 'topic c' },
        { uid: '45678', name: 'topic f' }
      ];

      updateLocalRanks(activeTopics, 3, 1, { dispatch });

      expect(dispatch).toHaveBeenCalledTimes(1);

      const dispatchedAction = dispatch.mock.calls[0][0];

      expect(dispatchedAction.type).toBe(UPDATE_LOCAL_RANKS);
      expect(dispatchedAction.payload).toEqual({
        12345: 0,
        45678: 1,
        23456: 2,
        34567: 3
      });
    });
  });

  describe('lockIn', () => {
    it('calls lockInService with guesses for a ranking player', () => {
      const localRanks = {
        12345: 0,
        23456: 1,
        34567: 2,
        45678: 3
      };

      lockIn({
        state: {
          gameUid: 'abcde',
          playerUid: 'bcdef',
          localRanks,
          game: { rankingPlayerUid: 'bcdef' }
        }
      });

      expect(lockInService).toHaveBeenCalledTimes(1);
      expect(lockInService.mock.calls[0][0]).toEqual({
        gameUid: 'abcde',
        playerUid: 'bcdef',
        guesses: {
          12345: 'active',
          23456: 'active',
          34567: 'active',
          45678: 'active'
        }
      });
    });

    it('calls lockInService with guesses for a guessing player', () => {
      const localRanks = {
        12345: 0,
        23456: 1,
        34567: 2,
        45678: 3
      };

      lockIn({
        state: {
          gameUid: 'abcde',
          playerUid: 'bcdef',
          localRanks,
          game: { rankingPlayerUid: '98765' }
        }
      });

      expect(lockInService).toHaveBeenCalledTimes(1);
      expect(lockInService.mock.calls[0][0]).toEqual({
        gameUid: 'abcde',
        playerUid: 'bcdef',
        guesses: {
          12345: 0,
          23456: 1,
          34567: 2,
          45678: 3
        }
      });
    });
  });

  describe('revealTopic', () => {
    it('calls updateGameService', () => {
      revealTopic('12345', {
        state: {
          gameUid: 'abcde',
          localRanks: { 12345: 2 },
          game: {
            state: 'ranking',
            topics: {
              12345: { rank: -1, status: 'active' },
              23456: { rank: -1, status: 'active' },
              34567: { rank: 3, status: 'unavailable' }
            }
          }
        }
      });

      expect(updateGameService).toHaveBeenCalledTimes(1);
      expect(updateGameService.mock.calls[0][1]).toBe('abcde');
      expect(updateGameService.mock.calls[0][0]).toEqual({
        state: 'ranking',
        topics: {
          12345: { rank: 2, status: 'ranked' },
          23456: { rank: -1, status: 'active' },
          34567: { rank: 3, status: 'unavailable' }
        }
      });
    });

    it('sets fully ranked when all topics are ranked', () => {
      revealTopic('12345', {
        state: {
          gameUid: 'abcde',
          localRanks: { 12345: 1 },
          game: {
            topics: {
              12345: { status: 'active' },
              23456: { status: 'ranked' },
              34567: { status: 'ranked' },
              45678: { status: 'ranked' }
            }
          }
        }
      });

      expect(updateGameService).toHaveBeenCalledTimes(1);
      expect(updateGameService.mock.calls[0][0].state).toBe(
        GAME_STATE.BETWEEN_ROUNDS
      );
    });
  });

  describe('togglePlayerActive', () => {
    it('deactives an active player', () => {
      togglePlayerActive('12345', {
        state: {
          gameUid: 'abcde',
          game: { players: { 12345: { active: true } } }
        }
      });

      expect(setPlayerActiveService).toHaveBeenCalledTimes(1);
      expect(setPlayerActiveService.mock.calls[0]).toEqual([
        '12345',
        false,
        'abcde'
      ]);
    });

    it('activates a deactive player', () => {
      togglePlayerActive('12345', {
        state: {
          gameUid: 'abcde',
          game: { players: { 12345: { active: false } } }
        }
      });

      expect(setPlayerActiveService).toHaveBeenCalledTimes(1);
      expect(setPlayerActiveService.mock.calls[0]).toEqual([
        '12345',
        true,
        'abcde'
      ]);
    });
  });
});
