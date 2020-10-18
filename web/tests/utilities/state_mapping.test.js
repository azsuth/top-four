import {
  teamsToArray,
  topicsToArray,
  availableTopicsToCount,
  topicsToPlayerTopics,
  playersToPlayersByTeam,
  toPlayer,
  toGameTurn,
  toTotalTurns,
  toRemainingTurns,
  toRankingPlayer,
  toUnlockedInPlayers,
  toGuessesByTopic,
  toAllPlayersWithScores
} from 'utilities/state_mapping';

describe('state mapping functions', () => {
  describe('teamsToArray', () => {
    it('takes an object of teams by ID and returns an array', () => {
      const teamsById = {
        12345: { name: 'Team 1' },
        23456: { name: 'Team 2' }
      };

      const teams = teamsToArray(teamsById);

      expect(teams).toEqual([
        { uid: '12345', name: 'Team 1' },
        { uid: '23456', name: 'Team 2' }
      ]);
    });
  });

  describe('topicsToArray', () => {
    it('takes an object of topics by ID and returns an array', () => {
      const topicsById = {
        12345: { topic: 'road trips', rank: 1 },
        23456: { topic: 'sex on the beach', rank: 2 }
      };

      const topics = topicsToArray(topicsById);

      expect(topics).toEqual([
        { uid: '12345', topic: 'road trips', rank: 1 },
        { uid: '23456', topic: 'sex on the beach', rank: 2 }
      ]);
    });
  });

  describe('availableTopicsToCount', () => {
    it('takes an object of topics by ID and returns the number of topics', () => {
      const topicsById = {
        12345: { topic: 'road trips', rank: 1, status: 'available' },
        23456: { topic: 'sex on the beach', rank: 2, status: 'available' },
        34567: { topic: 'socks with sandals', rank: 3, status: 'unavailable' }
      };

      const numTopics = availableTopicsToCount(topicsById);

      expect(numTopics).toBe(2);
    });
  });

  describe('topicsToPlayerTopics', () => {
    it('takes state and returns the current players topics as an array', () => {
      const topicsById = {
        12345: { topic: 'topic a', playerUid: 'abcde', status: 'available' },
        23456: { topic: 'topic b', playerUid: 'bcdef', status: 'available' },
        34567: { topic: 'topic c', playerUid: 'abcde', status: 'available' },
        45678: { topic: 'topic c', playerUid: 'abcde', status: 'unavailable' }
      };

      const playerTopics = topicsToPlayerTopics({
        playerUid: 'abcde',
        game: { topics: topicsById }
      });

      expect(playerTopics).toEqual([
        {
          uid: '12345',
          topic: 'topic a',
          playerUid: 'abcde',
          status: 'available'
        },
        {
          uid: '34567',
          topic: 'topic c',
          playerUid: 'abcde',
          status: 'available'
        }
      ]);
    });
  });

  describe('playersToPlayersByTeam', () => {
    it('takes an object of players by ID and returns an object of teams by ID with players', () => {
      const players = {
        12345: { name: 'Andrew', teamUid: 'abcde' },
        23456: { name: 'Emily', teamUid: 'bcdef' },
        34567: { name: 'Harrison', teamUid: 'cdefg' },
        45678: { name: 'Lauren', teamUid: 'bcdef' }
      };

      const playersByTeam = playersToPlayersByTeam(players);

      expect(playersByTeam).toEqual({
        abcde: [{ uid: '12345', name: 'Andrew', teamUid: 'abcde' }],
        bcdef: [
          { uid: '23456', name: 'Emily', teamUid: 'bcdef' },
          { uid: '45678', name: 'Lauren', teamUid: 'bcdef' }
        ],
        cdefg: [{ uid: '34567', name: 'Harrison', teamUid: 'cdefg' }]
      });
    });
  });

  describe('toPlayer', () => {
    it('takes state and returns the current player object', () => {
      const state = {
        playerUid: '12345',
        game: {
          players: { 23456: { name: 'Andrew' }, 12345: { name: 'Emily' } }
        }
      };

      const player = toPlayer(state);

      expect(player).toEqual({ uid: '12345', name: 'Emily' });
    });
  });

  describe('toGameTurn', () => {
    it('takes an object of topics by ID and returns the current game turn', () => {
      const topicsById = {
        12345: { status: 'unavailable' },
        23456: { status: 'available' },
        34567: { status: 'unavailable' },
        45678: { status: 'unavailable' },
        56789: { status: 'unavailable' }
      };

      expect(toGameTurn(topicsById)).toBe(2);
    });
  });

  describe('toTotalTurns', () => {
    it('takes an object of topics by ID and returns the total possible rounds', () => {
      expect(
        toTotalTurns({
          1: {},
          2: {},
          3: {},
          4: {},
          5: {},
          6: {},
          7: {},
          8: {},
          9: {},
          10: {}
        })
      ).toBe(2);
    });
  });

  describe('toRemainingTurns', () => {
    it('takes an object of topics by ID and returns the number of remaining turns', () => {
      const topicsById = {
        12345: { status: 'unavailable' },
        23456: { status: 'available' },
        34567: { status: 'available' },
        45678: { status: 'available' },
        56789: { status: 'available' },
        67890: { status: 'unavailable' },
        78901: { status: 'available' },
        89012: { status: 'available' },
        90123: { status: 'available' },
        11234: { status: 'available' },
        22345: { status: 'available' }
      };

      expect(toRemainingTurns(topicsById)).toBe(2);
    });
  });

  describe('toRankingPlayer', () => {
    it('takes game state and returns the ranking player object', () => {
      const game = {
        rankingPlayerUid: '23456',
        players: {
          12345: { name: 'Andrew' },
          23456: { name: 'Harrison' }
        }
      };

      expect(toRankingPlayer(game)).toEqual({ uid: '23456', name: 'Harrison' });
    });
  });

  describe('toUnlockedInPlayers', () => {
    it('takes an object of players by ID and returns all active players who are not locked in', () => {
      const players = {
        12345: { lockedIn: false, active: true },
        23456: { lockedIn: true, active: true },
        34567: { lockedIn: false, active: true },
        45678: { lockedIn: false, active: false },
        56789: { lockedIn: true, active: false }
      };

      expect(toUnlockedInPlayers(players)).toEqual([
        { uid: '12345', lockedIn: false, active: true },
        { uid: '34567', lockedIn: false, active: true }
      ]);
    });
  });

  describe('toGuessesByTopic', () => {
    it('takes an object of guesses by player ID and returns an object of topics by ID with guesses', () => {
      const guesses = {
        player_1: {
          topic_1: 0,
          topic_2: 2,
          topic_3: 1,
          topic_4: 3
        },
        player_2: {
          topic_1: 'active',
          topic_2: 'active',
          topic_3: 'active',
          topic_4: 'active'
        },
        player_3: {
          topic_1: 0,
          topic_2: 1,
          topic_3: 2,
          topic_4: 3
        }
      };

      expect(toGuessesByTopic(guesses)).toEqual({
        topic_1: [0, 0],
        topic_2: [2, 1],
        topic_3: [1, 2],
        topic_4: [3, 3]
      });
    });
  });

  describe('toAllPlayersWithScores', () => {
    it('takes guesses and topics and returns an object of players and their score', () => {
      const guesses = {
        player_1: {
          topic_1: 3,
          topic_2: 2,
          topic_3: 0,
          topic_4: 1
        },
        player_2: {
          topic_1: 'active',
          topic_2: 'active',
          topic_3: 'active',
          topic_4: 'active'
        },
        player_3: {
          topic_1: 0,
          topic_2: 1,
          topic_3: 2,
          topic_4: 3
        }
      };
      const topics = {
        topic_1: { rank: 3 },
        topic_2: { rank: 1 },
        topic_3: { rank: 2 },
        topic_4: { rank: 0 }
      };
      const players = {
        player_1: { name: 'Player 1' },
        player_2: { name: 'Player 2' },
        player_3: { name: 'Player 3' },
        player_4: { name: 'Player 4' }
      };

      expect(toAllPlayersWithScores({ guesses, topics, players })).toEqual([
        { uid: 'player_3', score: 2, name: 'Player 3' },
        { uid: 'player_1', score: 1, name: 'Player 1' },
        { uid: 'player_2', score: 0, name: 'Player 2' },
        { uid: 'player_4', score: 0, name: 'Player 4' }
      ]);
    });
  });
});
