import { toAllPlayersWithScores } from 'utilities/state_mapping';

jest.mock('utilities/state_mapping', () => ({
  toAllPlayersWithScores: jest.fn()
}));

import {
  theWinner,
  theLoser,
  theOpenBook,
  theStranger,
  getTopicGuesses
} from 'utilities/superlatives';

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

    it('returns null if all players are losers', () => {
      toAllPlayersWithScores.mockReturnValue([
        { uid: '12345', score: 10, active: true, name: 'Emily' },
        { uid: '23456', score: 10, active: true, name: 'Andrew' },
        { uid: '34567', score: 10, active: true, name: 'Harrison' }
      ]);

      expect(theLoser({})).toBe(null);
    });
  });

  describe('theOpenBook', () => {
    it('calculates the player whose rankings were guessed 100% the most', () => {
      const rankers = {
        12345: { numberPerfect: 3 },
        23456: { numberPerfect: 2 },
        34567: { numberPerfect: 0 }
      };
      const players = {
        12345: { name: 'Andrew' },
        23456: { name: 'Emily' },
        34567: { name: 'Harrison' }
      };

      const superlative = theOpenBook({ players }, { rankers });

      expect(superlative.recipient).toBe('Andrew');
      expect(superlative.footer).toBe(
        'The group guessed your rankings 100% correct 3 times!'
      );
    });

    it('calculates a tie', () => {
      const rankers = {
        12345: { numberPerfect: 3 },
        23456: { numberPerfect: 3 },
        34567: { numberPerfect: 0 }
      };
      const players = {
        12345: { name: 'Andrew' },
        23456: { name: 'Emily' },
        34567: { name: 'Harrison' }
      };

      const superlative = theOpenBook({ players }, { rankers });

      expect(superlative.recipient).toBe('Andrew, Emily');
      expect(superlative.footer).toBe(
        'The group guessed your rankings 100% correct 3 times!'
      );
    });

    it('returns null if all players tied', () => {
      const rankers = {
        12345: { numberPerfect: 0 },
        23456: { numberPerfect: 0 },
        34567: { numberPerfect: 0 }
      };
      const players = {
        12345: { name: 'Andrew' },
        23456: { name: 'Emily' },
        34567: { name: 'Harrison' }
      };

      expect(theOpenBook({ players }, { rankers })).toBe(null);
    });
  });

  describe('theStranger', () => {
    it('calculates the players whose rankings were guessed 0% the most', () => {
      const rankers = {
        12345: { numberCorrect: 8 },
        23456: { numberCorrect: 1 },
        34567: { numberCorrect: 6 }
      };
      const players = {
        12345: { name: 'Andrew' },
        23456: { name: 'Emily' },
        34567: { name: 'Harrison' }
      };

      const superlative = theStranger({ players }, { rankers });

      expect(superlative.recipient).toBe('Emily');
      expect(superlative.footer).toBe(
        'The group only scored 1 point guessing your rankings!'
      );
    });

    it('calculates a tie', () => {
      const rankers = {
        12345: { numberCorrect: 8 },
        23456: { numberCorrect: 4 },
        34567: { numberCorrect: 4 }
      };
      const players = {
        12345: { name: 'Andrew' },
        23456: { name: 'Emily' },
        34567: { name: 'Harrison' }
      };

      const superlative = theStranger({ players }, { rankers });

      expect(superlative.recipient).toBe('Emily, Harrison');
      expect(superlative.footer).toBe(
        'The group only scored 4 points on your turns!'
      );
    });

    it('returns null if all players tie', () => {
      const rankers = {
        12345: { numberCorrect: 4 },
        23456: { numberCorrect: 4 },
        34567: { numberCorrect: 4 }
      };
      const players = {
        12345: { name: 'Andrew' },
        23456: { name: 'Emily' },
        34567: { name: 'Harrison' }
      };

      expect(theStranger({ players }, { rankers })).toBe(null);
    });
  });

  describe('getTopicGuesses', () => {
    const guesses = {
      12345: {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 'active',
        f: 'active',
        g: 'active',
        h: 'active',
        i: 3,
        j: 2,
        k: 1,
        l: 0
      },
      23456: {
        a: 'active',
        b: 'active',
        c: 'active',
        d: 'active',
        e: 0,
        f: 1,
        g: 2,
        h: 3,
        i: 3,
        j: 2,
        k: 1,
        l: 0
      },
      34567: {
        a: 3,
        b: 2,
        c: 1,
        d: 0,
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
    const topics = {
      a: { rank: 0 },
      b: { rank: 1 },
      c: { rank: 2 },
      d: { rank: 3 },
      e: { rank: 0 },
      f: { rank: 1 },
      g: { rank: 2 },
      h: { rank: 3 },
      i: { rank: 0 },
      j: { rank: 1 },
      k: { rank: 2 },
      l: { rank: 3 }
    };

    it('returns an object of topic IDs with their guesses', () => {
      const topicGuesses = getTopicGuesses({ guesses, topics });

      expect(topicGuesses.a).toEqual({
        correctRank: 0,
        guesses: [0, 3],
        numCorrect: 1,
        numIncorrect: 1,
        ranker: '23456'
      });
    });
  });
});
