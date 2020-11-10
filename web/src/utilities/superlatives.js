import { toAllPlayersWithScores } from 'utilities/state_mapping';

function generateSuperlatives(gameData) {
  return [theWinner(gameData), theLoser(gameData)];
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

export { theWinner, theLoser };
export default generateSuperlatives;
