import { GAME_STATE } from 'utilities/constants';

import { getGameState } from 'components/game/with_game_state';

function MockComponent() {
  return <div />;
}

describe('withGameState(WrappedComponent)', () => {
  describe('getGameState', () => {
    it('returns between rounds state', () => {
      expect(
        getGameState({
          remoteGameState: GAME_STATE.BETWEEN_ROUNDS,
          player: {},
          players: [{ uid: '12345' }]
        }).state
      ).toBe(GAME_STATE.BETWEEN_ROUNDS);
    });

    describe('next ranker', () => {
      it('defaults to the first player when there is no previous ranker', () => {
        const players = [{ uid: '12345' }, { uid: '23456' }, { uid: '34567' }];

        expect(
          getGameState({
            remoteGameState: GAME_STATE.BETWEEN_ROUNDS,
            player: {},
            players
          }).nextRanker.uid
        ).toBe('12345');
      });

      it('calculates the next ranker in between turns', () => {
        const players = [{ uid: '12345' }, { uid: '23456' }, { uid: '34567' }];

        expect(
          getGameState({
            remoteGameState: GAME_STATE.BETWEEN_ROUNDS,
            player: {},
            rankingPlayerUid: '12345',
            players,
            numRounds: 1,
            playerTurns: {}
          }).nextRanker.uid
        ).toBe('23456');
      });

      it('wraps the next ranker in between rounds', () => {
        const players = [{ uid: '12345' }, { uid: '23456' }, { uid: '34567' }];

        expect(
          getGameState({
            remoteGameState: GAME_STATE.BETWEEN_ROUNDS,
            player: {},
            rankingPlayerUid: '34567',
            players,
            numRounds: 1,
            playerTurns: {}
          }).nextRanker.uid
        ).toBe('12345');
      });

      it('is the current player', () => {
        const players = [{ uid: '12345' }, { uid: '23456' }, { uid: '34567' }];

        expect(
          getGameState({
            remoteGameState: GAME_STATE.BETWEEN_ROUNDS,
            player: { uid: '34567' },
            rankingPlayerUid: '23456',
            players,
            numRounds: 1,
            playerTurns: {}
          }).nextRanker.isThisPlayer
        ).toBe(true);
      });

      it('is not the current player', () => {
        const players = [{ uid: '12345' }, { uid: '23456' }, { uid: '34567' }];

        expect(
          getGameState({
            remoteGameState: GAME_STATE.BETWEEN_ROUNDS,
            player: { uid: '12345' },
            rankingPlayerUid: '23456',
            players,
            numRounds: 1,
            playerTurns: {}
          }).nextRanker.isThisPlayer
        ).toBe(false);
      });
    });

    it('returns ranking state for the ranking player', () => {
      expect(
        getGameState({
          remoteGameState: 'ranking',
          rankingPlayerUid: '12345',
          player: { uid: '12345', lockedIn: false },
          players: [{ uid: '12345' }]
        })
      ).toEqual({ state: GAME_STATE.RANKING, ranker: true });
    });

    it('returns ranking state for the guessing player', () => {
      expect(
        getGameState({
          remoteGameState: 'ranking',
          rankingPlayerUid: '23456',
          player: { uid: '12345', lockedIn: false },
          players: [{ uid: '23456' }]
        })
      ).toEqual({ state: GAME_STATE.RANKING, ranker: false });
    });

    it('returns locked in state for the ranking player', () => {
      expect(
        getGameState({
          remoteGameState: 'ranking',
          rankingPlayerUid: '12345',
          player: { uid: '12345', lockedIn: true },
          players: [{ uid: '12345' }]
        })
      ).toEqual({ state: GAME_STATE.LOCKED_IN, ranker: true });
    });

    it('returns locked in state for the guessing player', () => {
      expect(
        getGameState({
          remoteGameState: 'ranking',
          rankingPlayerUid: '23456',
          player: { uid: '12345', lockedIn: true },
          players: [{ uid: '23456' }]
        })
      ).toEqual({ state: GAME_STATE.LOCKED_IN, ranker: false });
    });

    it('returns end game state when the last player has taken number of turns equal to number of rounds', () => {
      const players = [{ uid: '12345' }, { uid: '23456' }, { uid: '34567' }];
      const playerTurns = { 12345: 2, 23465: 2, 34567: 2 };

      expect(
        getGameState({
          remoteGameState: GAME_STATE.BETWEEN_ROUNDS,
          rankingPlayerUid: '34567',
          player: {},
          players,
          numRounds: 2,
          playerTurns
        }).state
      ).toBe(GAME_STATE.END_GAME);
    });
  });
});
