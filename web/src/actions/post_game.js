import { GAME_STATE } from 'utilities/constants';
import { updateGameService } from '@services';

function endGame({ state: { gameUid } }) {
  const game = {
    state: GAME_STATE.END_GAME
  };

  updateGameService(game, gameUid);
}

export { endGame };
