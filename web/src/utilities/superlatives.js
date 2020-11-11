import { toAllPlayersWithScores } from 'utilities/state_mapping';

function generateSuperlatives(gameData) {
  const playerCount = Object.values(gameData.players).map(
    ({ active }) => active
  ).length;

  const allPlayersSuperlatives = [theWinner(gameData), theLoser(gameData)];

  if (playerCount > 2) {
    const topicGuesses = getTopicGuesses(gameData);
    const rankers = getRankers(topicGuesses);

    return [
      ...allPlayersSuperlatives,
      theOpenBook(gameData, { rankers }),
      theStranger(gameData, { rankers })
    ].filter(superlative => !!superlative);
  }

  return allPlayersSuperlatives.filter(superlative => !!superlative);
}

function getTopicGuesses({ guesses, topics }) {
  return Object.keys(guesses).reduce((accum, playerUid) => {
    Object.keys(guesses[playerUid]).forEach(topicUid => {
      if (!accum[topicUid]) {
        accum[topicUid] = {
          correctRank: topics[topicUid].rank,
          guesses: [],
          ranker: undefined,
          numberCorrect: 0,
          numberIncorrect: 0
        };
      }

      if (guesses[playerUid][topicUid] === 'active') {
        accum[topicUid].ranker = playerUid;
      } else {
        const guess = guesses[playerUid][topicUid];

        accum[topicUid].guesses.push(guess);

        if (guess === accum[topicUid].correctRank) {
          accum[topicUid].numberCorrect += 1;
        } else {
          accum[topicUid].numberIncorrect += 1;
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

    if (topicGuess.numberIncorrect === 0) {
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
      ...rankers[rankerUid],
      ...players[rankerUid]
    }))
    .sort(
      ({ numberPerfect: numberPerfectA }, { numberPerfect: numberPerfectB }) =>
        numberPerfectB - numberPerfectA
    );

  const mostPerfectCount = sortedRankers[0].numberPerfect;
  const mostPerfectPlayers = sortedRankers.filter(
    ({ numberPerfect }) => numberPerfect === mostPerfectCount
  );

  if (mostPerfectPlayers.length === sortedRankers.length) return null;

  if (mostPerfectPlayers.length === 1) {
    const mostPerfectPlayer = mostPerfectPlayers[0];

    return {
      header: 'The Open Book',
      subheader: 'No need to judge you by your cover',
      recipient: mostPerfectPlayer.name,
      footer: `The group guessed your rankings 100% correct ${mostPerfectCount} time${
        mostPerfectCount !== 1 ? 's' : ''
      }!`
    };
  }

  return {
    header: 'The Open Book',
    subheader: 'A few of you need some more mystery in your life',
    recipient: mostPerfectPlayers.map(({ name }) => name).join(', '),
    footer: `The group guessed your rankings 100% correct ${mostPerfectCount} time${
      mostPerfectCount !== 1 ? 's' : ''
    }!`
  };
}

function theStranger({ players }, { rankers }) {
  const sortedRankers = Object.keys(rankers)
    .map(rankerUid => ({
      uid: rankerUid,
      ...rankers[rankerUid],
      ...players[rankerUid]
    }))
    .sort(
      ({ numberCorrect: numberCorrectA }, { numberCorrect: numberCorrectB }) =>
        numberCorrectA - numberCorrectB
    );

  const lowestScore = sortedRankers[0].numberCorrect;
  const lowestScorePlayers = sortedRankers.filter(
    ({ numberCorrect }) => numberCorrect === lowestScore
  );

  if (lowestScorePlayers.length === sortedRankers.length) return null;

  if (lowestScorePlayers.length === 1) {
    const lowestScorePlayer = lowestScorePlayers[0];

    let footer;
    if (lowestScore === 0) {
      footer = 'The group scored ZERO points guessing your rankings!';
    } else {
      footer = `The group only scored ${lowestScore} point${
        lowestScore !== 1 ? 's' : ''
      } guessing your rankings!`;
    }

    return {
      header: 'The Complete Stranger',
      subheader: 'Do you know anyone here?',
      recipient: lowestScorePlayer.name,
      footer
    };
  }

  let footer;
  if (lowestScore === 0) {
    footer = 'The group scored ZERO points on your turns!';
  } else {
    footer = `The group only scored ${lowestScore} point${
      lowestScore !== 1 ? 's' : ''
    } on your turns!`;
  }

  return {
    header: 'The Complete Stranger',
    subheader: 'Did you come here together?',
    recipient: lowestScorePlayers.map(({ name }) => name).join(', '),
    footer
  };
}

export { theWinner, theLoser, theOpenBook, theStranger, getTopicGuesses };
export default generateSuperlatives;
