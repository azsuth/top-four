import { GAME_STATE } from 'utilities/constants';
import { updateGameService } from '@services';

function endGame({ state: { gameUid } }) {
  const game = {
    state: GAME_STATE.END_GAME,
    rankingPlayerUid: null
  };

  updateGameService(game, gameUid);
}

function revealWinner({ state: { gameUid } }) {
  const game = { state: GAME_STATE.WINNERS_REVEALED };

  updateGameService(game, gameUid);
}

function playAnotherRound({
  state: {
    game: { numRounds },
    gameUid
  }
}) {
  const game = {
    state: GAME_STATE.ADD_MORE_TOPICS,
    numRounds: numRounds + 1
  };

  updateGameService(game, gameUid);
}

export { endGame, revealWinner, playAnotherRound };
