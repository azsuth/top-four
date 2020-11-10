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

export { endGame };
