const teamsToArray = teams =>
  Object.keys(teams).map(uid => ({ uid, ...teams[uid] }));

const topicsToArray = topics =>
  Object.keys(topics).map(uid => ({ uid, ...topics[uid] }));

const playersToArray = players =>
  Object.keys(players).map(uid => ({ uid, ...players[uid] }));

const availableTopicsToCount = topics =>
  topicsToArray(topics).filter(({ status }) => status === 'available').length;

const topicsToPlayerTopics = ({ playerUid, game: { topics = {} } }) =>
  topicsToArray(topics).filter(
    topic => topic.playerUid === playerUid && topic.status === 'available'
  );

const playersToPlayersByTeam = players =>
  playersToArray(players).reduce((playersByTeam, player) => {
    const { teamUid } = player;

    const team = playersByTeam[teamUid] || [];

    return {
      ...playersByTeam,
      [teamUid]: [...team, player]
    };
  }, {});

const toPlayer = ({ playerUid, game: { players } }) => ({
  ...players[playerUid],
  uid: playerUid
});

const toGameTurn = topics =>
  1 +
  Math.ceil(
    topicsToArray(topics).filter(({ status }) => status === 'unavailable')
      .length / 4
  );

const toTotalTurns = topics => Math.floor(topicsToArray(topics).length / 4);

const toRemainingTurns = topics =>
  Math.floor(
    topicsToArray(topics).filter(({ status }) => status === 'available')
      .length / 4
  );

const toRankingPlayer = ({ rankingPlayerUid, players }) => ({
  uid: rankingPlayerUid,
  ...players[rankingPlayerUid]
});

const toActiveTopics = topics =>
  topicsToArray(topics).filter(
    ({ status }) => status === 'active' || status === 'ranked'
  );

const toUnlockedInPlayers = players =>
  playersToArray(players).filter(({ lockedIn, active }) => !lockedIn && active);

const toGuessesByTopic = guesses =>
  Object.keys(guesses)
    .map(playerUid => ({ ...guesses[playerUid] }))
    .reduce((topicGuesses, playerGuesses) => {
      Object.keys(playerGuesses).forEach(topicUid => {
        const playerGuess = playerGuesses[topicUid];

        if (playerGuess === 'active') return;

        topicGuesses[topicUid] = [
          ...(topicGuesses[topicUid] || []),
          playerGuess
        ];
      });

      return topicGuesses;
    }, {});

const toAllPlayersWithScores = ({ guesses, topics, players }) => {
  const playerScores = Object.keys(guesses || {}).reduce(
    (playerScores, playerUid) => {
      const playerGuesses = guesses[playerUid];

      const playerScore = Object.keys(playerGuesses).reduce(
        (score, topicUid) => {
          const playerGuess = playerGuesses[topicUid];
          const topic = topics[topicUid];
          const correctGuess = playerGuess === topic.rank ? 1 : 0;

          return score + correctGuess;
        },
        0
      );

      return { ...playerScores, [playerUid]: playerScore };
    },
    {}
  );

  return playersToArray(players)
    .map(player => ({
      ...player,
      score: playerScores[player.uid] || 0
    }))
    .sort(({ score: scoreA }, { score: scoreB }) => scoreB - scoreA);
};

const toAllActivePlayers = players =>
  playersToArray(players).filter(({ active }) => active);

const toAvailableAndRankingTopicsCount = topics =>
  topicsToArray(topics).filter(
    ({ status }) => status === 'available' || status === 'active'
  ).length;

export {
  teamsToArray,
  topicsToArray,
  availableTopicsToCount,
  topicsToPlayerTopics,
  playersToPlayersByTeam,
  toPlayer,
  toGameTurn,
  toTotalTurns,
  toRankingPlayer,
  toActiveTopics,
  toUnlockedInPlayers,
  toGuessesByTopic,
  toRemainingTurns,
  toAllPlayersWithScores,
  toAllActivePlayers,
  toAvailableAndRankingTopicsCount
};
