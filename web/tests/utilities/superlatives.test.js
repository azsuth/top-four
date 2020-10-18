import { toAllPlayersWithScores } from 'utilities/state_mapping';

jest.mock('utilities/state_mapping', () => ({
  toAllPlayersWithScores: jest.fn()
}));

import { theWinner, theLoser } from 'utilities/superlatives';

describe('superlative functions', () => {
  afterEach(() => {
    toAllPlayersWithScores.mockRestore();
  });

  describe('theWinner', () => {
    it('calculates the winner', () => {
      const guesses = {
        23456: {
          a: 0,
          b: 1,
          c: 2,
          d: 3,
          e: 0,
          f: 1,
          g: 2,
          h: 3,
          i: 'active',
          j: 'active',
          k: 'active',
          l: 'active'
        }
      };

      toAllPlayersWithScores.mockReturnValue([
        { uid: '12345', score: 9, active: false, name: 'Harrison' },
        { uid: '23456', score: 5, active: true, name: 'Andrew' },
        { uid: '34567', score: 4, active: true, name: 'Emily' }
      ]);

      const superlative = theWinner({ guesses });
      expect(superlative.recipient).toBe('Andrew');
      expect(superlative.footer).toBe('63% of your guesses were correct!');
    });

    it('calculates a winning tie', () => {
      toAllPlayersWithScores.mockReturnValue([
        { uid: '12345', score: 9, active: false, name: 'Emily' },
        { uid: '23456', score: 10, active: true, name: 'Andrew' },
        { uid: '34567', score: 10, active: true, name: 'Harrison' }
      ]);

      expect(theWinner({}).recipient).toBe('Andrew, Harrison');
    });
  });

  describe('theLoser', () => {
    it('calculates the loser', () => {
      const guesses = {
        34567: {
          a: 0,
          b: 1,
          c: 2,
          d: 3,
          e: 0,
          f: 1,
          g: 2,
          h: 3,
          i: 'active',
          j: 'active',
          k: 'active',
          l: 'active'
        }
      };

      toAllPlayersWithScores.mockReturnValue([
        { uid: '12345', score: 9, active: false, name: 'Harrison' },
        { uid: '23456', score: 5, active: true, name: 'Andrew' },
        { uid: '34567', score: 3, active: true, name: 'Emily' }
      ]);

      const superlative = theLoser({ guesses });
      expect(superlative.recipient).toBe('Emily');
      expect(superlative.footer).toBe('62% of your guesses were wrong :(');
    });

    it('calculates a losing tie', () => {
      toAllPlayersWithScores.mockReturnValue([
        { uid: '12345', score: 11, active: true, name: 'Emily' },
        { uid: '23456', score: 10, active: true, name: 'Andrew' },
        { uid: '34567', score: 10, active: true, name: 'Harrison' }
      ]);

      expect(theLoser({}).recipient).toBe('Andrew, Harrison');
    });
  });
});
