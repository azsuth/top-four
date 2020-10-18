import { h } from 'preact';

import { GAME_STATE } from 'utilities/constants';

import ConfirmButton from 'components/game/confirm_button';

const footerContentForState = ({
  gameState: { state, unlockedInPlayers, nextRanker },
  startRound,
  lockIn,
  endGame
}) => {
  switch (state) {
    case GAME_STATE.END_GAME:
      if (nextRanker.isThisPlayer) {
        return (
          <ConfirmButton confirmText="End the game?" confirmAction={endGame} />
        );
      }

      return (
        <ConfirmButton
          helperText={`Tell ${nextRanker.name} to end the game!`}
        />
      );
    case GAME_STATE.BETWEEN_ROUNDS:
      if (nextRanker.isThisPlayer) {
        return (
          <ConfirmButton
            confirmText="Start"
            confirmAction={startRound}
            helperText="Hey, it's your turn!"
          />
        );
      }

      return (
        <ConfirmButton
          helperText={`Tell ${nextRanker.name} to start the next round!`}
        />
      );
    case GAME_STATE.RANKING:
      return <ConfirmButton confirmText="Lock in" confirmAction={lockIn} />;
    case GAME_STATE.LOCKED_IN:
      if (unlockedInPlayers.length === 0) {
        return <ConfirmButton helperText="Everyone's locked in!" />;
      }

      if (unlockedInPlayers.length === 1) {
        return (
          <ConfirmButton
            helperText={`Waiting on ${unlockedInPlayers[0].name} to lock in!`}
          />
        );
      }

      return (
        <ConfirmButton
          helperText={`Waiting on ${unlockedInPlayers.length} players to lock in!`}
        />
      );
  }
};

const headerState = ({ gameState: { state, ranker }, rankingPlayer }) => {
  switch (state) {
    case GAME_STATE.END_GAME:
      return {
        header: 'Game Over!',
        subheader: 'Wanna play another round?'
      };
    case GAME_STATE.BETWEEN_ROUNDS:
      return {
        header: 'Waiting',
        subheader: '...for the next turn to start'
      };
    case GAME_STATE.RANKING:
      if (ranker) {
        return {
          header: 'Your Turn',
          subheader: 'Rank these topics, best to worst'
        };
      }

      return {
        header: 'Guess',
        subheader: `...how ${rankingPlayer.name} would rank these topics, best to worst`
      };
    case GAME_STATE.LOCKED_IN:
      if (ranker) {
        return {
          header: 'Your Turn',
          subheader: 'Reveal your ranking'
        };
      }

      return {
        header: `${rankingPlayer.name}'s Reveal`,
        subheader: `How'd ya do?`
      };
  }
};

export { footerContentForState, headerState };
