import { h } from 'preact';
import { Paper } from '@material-ui/core';
import compose from 'utilities/compose';

import { withAction } from '@state';
import { startRound, lockIn } from '@actions';
import withRouter, { toAddTopics } from 'utilities/router';

import { footerContentForState } from 'components/game/game_state_helpers';

const Footer = ({ gameState, startRound, lockIn, routes: [toAddTopics] }) => {
  return (
    <Paper elevation={3}>
      <div class="game-footer">
        {footerContentForState({
          gameState,
          startRound,
          lockIn,
          addMoreTopics: toAddTopics
        })}
      </div>
    </Paper>
  );
};

// actions
const withStartRoundAction = withAction(startRound, 'startRound');
const withLockInAction = withAction(lockIn, 'lockIn');

// routes
const withRoutes = withRouter(toAddTopics);

const wrappers = compose(withStartRoundAction, withLockInAction, withRoutes);

export { Footer };
export default wrappers(Footer);
