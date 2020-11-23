import { toAllPlayersWithScores } from 'utilities/state_mapping';

jest.mock('utilities/state_mapping', () => ({
  toAllPlayersWithScores: jest.fn()
}));

import {
  theWinner,
  theLoser,
  theOpenBook,
  theStranger,
  theTortoise,
  theHare,
  theDeepThinker,
  theGoWithYourGut,
  getTopicGuesses,
  getTimedPlayers
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
    it('calculates the player others scored the most points against', () => {
      const rankers = {
        12345: { numberCorrect: 3 },
        23456: { numberCorrect: 2 },
        34567: { numberCorrect: 0 }
      };
      const players = {
        12345: { name: 'Andrew' },
        23456: { name: 'Emily' },
        34567: { name: 'Harrison' }
      };

      const superlative = theOpenBook({ numRounds: 1, players }, { rankers });

      expect(superlative.recipient).toBe('Andrew');
      expect(superlative.footer).toBe(
        'The group scored the most points on your turn!'
      );
    });

    it('calculates a tie', () => {
      const rankers = {
        12345: { numberCorrect: 3 },
        23456: { numberCorrect: 3 },
        34567: { numberCorrect: 0 }
      };
      const players = {
        12345: { name: 'Andrew' },
        23456: { name: 'Emily' },
        34567: { name: 'Harrison' }
      };

      const superlative = theOpenBook({ players }, { rankers });

      expect(superlative.recipient).toBe('Andrew, Emily');
      expect(superlative.footer).toBe(
        'The group scored the most points on your turns!'
      );
    });

    it('returns null if all players tied', () => {
      const rankers = {
        12345: { numberCorrect: 0 },
        23456: { numberCorrect: 0 },
        34567: { numberCorrect: 0 }
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
    it('calculates the player others scored the fewest points against', () => {
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

  describe('timed superlatives', () => {
    const timedPlayers = [
      {
        name: 'Andrew',
        fastestRankingTime: 5,
        slowestRankingTime: 3,
        averageRankingTime: 1.5
      },
      {
        name: 'Emily',
        fastestRankingTime: 1,
        slowestRankingTime: 2,
        averageRankingTime: 2
      },
      {
        name: 'Harrison',
        fastestRankingTime: 2,
        slowestRankingTime: 10,
        averageRankingTime: 6
      }
    ];

    describe('theTortoise', () => {
      it('calculates the slowest average ranker', () => {
        const superlative = theTortoise(timedPlayers);

        expect(superlative.recipient).toBe('Harrison');
      });
    });

    describe('theHare', () => {
      it('calculates the fastest average ranker', () => {
        const superlative = theHare(timedPlayers);

        expect(superlative.recipient).toBe('Andrew');
      });
    });

    describe('theDeepThinker', () => {
      it('calculates the player with the slowest rank', () => {
        const superlative = theDeepThinker(timedPlayers);

        expect(superlative.recipient).toBe('Harrison');
      });
    });

    describe('theGoWithYourGut', () => {
      it('calculates the player with the fastest rank', () => {
        const superlative = theGoWithYourGut(timedPlayers);

        expect(superlative.recipient).toBe('Emily');
      });
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
        numberCorrect: 1,
        numberIncorrect: 1,
        ranker: '23456'
      });
    });
  });

  describe('getTimedPlayers', () => {
    it('calculates ranking time stats for all players', () => {
      const players = {
        abcde: { name: 'Andrew', rankingTimes: [1, 2, 3] },
        bcdef: { name: 'Emily', rankingTimes: [2, 2, 2, 2] },
        cdefg: { name: 'Harrison', rankingTimes: [2, 10] }
      };

      const timedPlayers = getTimedPlayers({ players });

      expect(timedPlayers[0].name).toBe('Andrew');
      expect(timedPlayers[0].slowestRankingTime).toBe(3);
      expect(timedPlayers[0].fastestRankingTime).toBe(1);
      expect(timedPlayers[0].averageRankingTime).toBe(2);

      expect(timedPlayers[1].name).toBe('Emily');
      expect(timedPlayers[1].slowestRankingTime).toBe(2);
      expect(timedPlayers[1].fastestRankingTime).toBe(2);
      expect(timedPlayers[1].averageRankingTime).toBe(2);

      expect(timedPlayers[2].name).toBe('Harrison');
      expect(timedPlayers[2].slowestRankingTime).toBe(10);
      expect(timedPlayers[2].fastestRankingTime).toBe(2);
      expect(timedPlayers[2].averageRankingTime).toBe(6);
    });
  });
});
