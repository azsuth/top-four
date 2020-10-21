import { GAME_STATE } from 'utilities/constants';
import { updateGameService } from '@services';

function endGame({
  state: {
    gameUid,
    game: { topics, players }
  }
}) {
  const game = {
    rankingPlayerUid: null,
    state: GAME_STATE.END_GAME,
    topics: { ...topics },
    players: { ...players }
  };

  // mark all players not locked in
  Object.keys(players).forEach(uid => (game.players[uid].lockedIn = false));

  // update all ranked topics to unavailable
  Object.keys(topics)
    .map(uid => ({ uid, ...topics[uid] }))
    .filter(({ status }) => status === 'ranked')
    .map(({ uid }) => uid)
    .forEach(uid => (game.topics[uid].status = 'unavailable'));

  updateGameService(game, gameUid);
}

function revealWinner({ state: { gameUid } }) {
  const game = { state: GAME_STATE.WINNERS_REVEALED };

  updateGameService(game, gameUid);
}

function playAnotherRound({
  state: {
    game: { numRounds, topics, players },
    gameUid
  }
}) {
  const numActivePlayers = Object.values(players).filter(({ active }) => active)
    .length;
  const requiredTopics = numActivePlayers * 4;
  const availableTopics = Object.values(topics).filter(
    ({ status }) => status === 'available'
  ).length;

  const game = {
    state:
      availableTopics >= requiredTopics
        ? GAME_STATE.ANOTHER_ROUND
        : GAME_STATE.ADD_MORE_TOPICS,
    numRounds: numRounds + 1
  };

  updateGameService(game, gameUid);
}

export { endGame, revealWinner, playAnotherRound };
