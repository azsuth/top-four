import { toAllPlayersWithScores } from 'utilities/state_mapping';

function generateSuperlatives(gameData) {
  const topicGuesses = getTopicGuesses(gameData);
  const rankers = getRankers(topicGuesses);

  return [
    theWinner(gameData),
    theLoser(gameData),
    theOpenBook(gameData, { topicGuesses, rankers })
  ].filter(superlative => !!superlative);
}

function getTopicGuesses({ guesses, topics }) {
  return Object.keys(guesses).reduce((accum, playerUid) => {
    Object.keys(guesses[playerUid]).forEach(topicUid => {
      if (!accum[topicUid]) {
        accum[topicUid] = {
          correctRank: topics[topicUid].rank,
          guesses: [],
          ranker: undefined,
          numCorrect: 0,
          numIncorrect: 0
        };
      }

      if (guesses[playerUid][topicUid] === 'active') {
        accum[topicUid].ranker = playerUid;
      } else {
        const guess = guesses[playerUid][topicUid];

        accum[topicUid].guesses.push(guess);

        if (guess === accum[topicUid].correctRank) {
          accum[topicUid].numCorrect += 1;
        } else {
          accum[topicUid].numIncorrect += 1;
        }
      }
    });

    return accum;
  }, {});
}

function getRankers(topicGuesses) {
  return Object.keys(topicGuesses).reduce((accum, topicUid) => {
    const topicGuess = topicGuesses[topicUid];
    const rankerUid = topicGuess.ranker;

    if (!accum[rankerUid]) {
      accum[rankerUid] = {
        numberCorrect: 0,
        numberLied: 0,
        numberPerfect: 0
      };
    }

    accum[rankerUid].numberCorrect += topicGuess.numberCorrect;

    if (
      topicGuess.numberCorrect === 0 &&
      new Set(topicGuess.guesses).size === 1
    ) {
      accum[rankerUid].numberLied += 1;
    }

    if (topicGuess.numIncorrect === 0) {
      accum[rankerUid].numberPerfect += 1;
    }

    return accum;
  }, {});
}

function theWinner({ guesses, players, topics }) {
  const playerScores = toAllPlayersWithScores({
    guesses,
    players,
    topics
  }).filter(({ active }) => active);

  const winningScore = playerScores[0].score;
  const winningPlayers = playerScores.filter(
    ({ score }) => score === winningScore
  );

  if (winningPlayers.length === 1) {
    const winningPlayer = winningPlayers[0];
    const totalGuesses = Object.values(guesses[winningPlayer.uid]).filter(
      guess => guess !== 'active'
    ).length;
    const percentCorrect = Math.round(
      (winningPlayer.score / totalGuesses) * 100
    );

    return {
      header: 'The Winner',
      subheader: 'Congrats!',
      recipient: winningPlayer.name,
      footer: `${percentCorrect}% of your guesses were correct!`
    };
  }

  return {
    header: 'The Winners',
    subheader: "There's a tie!",
    recipient: winningPlayers.map(({ name }) => name).join(', '),
    footer: 'Maybe arm wrestle for it?'
  };
}

function theLoser({ guesses, players, topics }) {
  const playerScores = toAllPlayersWithScores({
    guesses,
    players,
    topics
  }).filter(({ active }) => active);

  const losingScore = playerScores[playerScores.length - 1].score;
  const losingPlayers = playerScores.filter(
    ({ score }) => score === losingScore
  );

  if (losingPlayers.length === playerScores.length) return null;

  if (losingPlayers.length === 1) {
    const losingPlayer = losingPlayers[0];
    const totalGuesses = Object.values(guesses[losingPlayer.uid]).filter(
      guess => guess !== 'active'
    ).length;
    const percentWrong =
      100 - Math.round((losingPlayer.score / totalGuesses) * 100);

    return {
      header: 'The Loser',
      subheader: 'Womp, womp...',
      recipient: losingPlayer.name,
      footer: `${percentWrong}% of your guesses were wrong :(`
    };
  }

  return {
    header: 'The Losers',
    subheader: 'So much mediocrity',
    recipient: losingPlayers.map(({ name }) => name).join(', '),
    footer: 'At least you lost together...'
  };
}

function theOpenBook({ players }, { rankers }) {
  const sortedRankers = Object.keys(rankers)
    .map(rankerUid => ({
      uid: rankerUid,
      ...rankers[rankerUid]
    }))
    .sort(
      ({ numberPerfect: numberPerfectA }, { numberPerfect: numberPerfectB }) =>
        numberPerfectB - numberPerfectA
    );

  const mostPerfectCount = sortedRankers[0].numberPerfect;
  const mostPerfectPlayers = sortedRankers.filter(
    ({ numberPerfect }) => numberPerfect === mostPerfectCount
  );

  if (mostPerfectPlayers.length === Object.keys(players).length) return null;

  if (mostPerfectPlayers.length === 1) {
    const mostPerfectPlayer = players[mostPerfectPlayers[0].uid];

    return {
      header: 'The Open Book',
      subheader: 'No need to judge you by your cover',
      recipient: mostPerfectPlayer.name,
      footer: `The group guessed your rankings 100% correct ${mostPerfectCount} times!`
    };
  }

  return {
    header: 'The Open Book',
    subheader: 'A few of you need some more mystery in your life',
    recipient: mostPerfectPlayers
      .map(({ uid }) => players[uid].name)
      .join(', '),
    footer: `The group guessed your rankings 100% correct ${mostPerfectCount} times!`
  };
}

export { theWinner, theLoser, theOpenBook, getTopicGuesses };
export default generateSuperlatives;
