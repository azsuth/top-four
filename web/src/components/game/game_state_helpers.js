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
          <ConfirmButton
            confirmText="Reveal the winner?"
            confirmAction={endGame}
            skipConfirm
          />
        );
      }

      return (
        <ConfirmButton
          helperText={`Waiting on ${nextRanker.name} to reveal the winner!`}
        />
      );
    case GAME_STATE.BETWEEN_ROUNDS:
      if (nextRanker.isThisPlayer) {
        return (
          <ConfirmButton
            confirmText="Start"
            confirmAction={startRound}
            skipConfirm
          />
        );
      }

      return (
        <ConfirmButton
          helperText={`Tell ${nextRanker.name} to start ranking!`}
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

const headerState = ({
  gameState: { state, ranker, nextRanker },
  rankingPlayer
}) => {
  switch (state) {
    case GAME_STATE.END_GAME:
      return {
        header: 'Game Over!',
        subheader: 'Who won?'
      };
    case GAME_STATE.BETWEEN_ROUNDS:
      if (nextRanker.isThisPlayer) {
        return {
          header: `You're up`,
          subheader: 'Time to start ranking!'
        };
      }

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
