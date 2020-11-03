import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Router, getCurrentUrl } from 'preact-router';

import { GAME_STATE, IN_PROGRESS_URL_REGEX } from 'utilities/constants';
import compose from 'utilities/compose';
import resolve from 'utilities/resolve';
import cx from 'utilities/cx';
import withRouter, { toEnd, toGame } from 'utilities/router';

import { withAction, withState } from '@state';
import { subscribeToGameUpdates } from '@actions';

import ErrorBoundary from 'components/error_boundary';

// Code-splitting is automated for routes
import Home from 'routes/home';
import Join from 'routes/join';
import Create from 'routes/create';
import Players from 'routes/players';
import AddTopics from 'routes/add_topics';
import Game from 'routes/game';
import End from 'routes/end';
import Storybook from 'routes/storybook';

import CoachmarkContent from 'components/shared/coachmark_content';

const App = ({ coachmark, theme }) => {
  const { show, content } = coachmark || {};

  const appContentClass = cx('app-content', {
    'app-content--blur-in': !!content,
    'app-content--blur-out': !content
  });

  return (
    <div id="app" class={`theme-${theme}`}>
      <ErrorBoundary>
        <div class={appContentClass}>
          <Router>
            <Home path="/" />
            <Join path="/join" />
            <Create path="/create" />
            <Players path="/:routeGameId/players" />
            <AddTopics path="/:routeGameId/topics" />
            <Game path="/:routeGameId/game" />
            <End path="/:routeGameId/end" />
            <Storybook path="/storybook" />
          </Router>
        </div>
        {show && <CoachmarkContent content={content} />}
      </ErrorBoundary>
    </div>
  );
};

// state
const withCoachmarkContentState = withState('coachmark');
const withFullState = withState(null, 'fullState');
const withThemeState = withState('theme');

// actions
const withSubscribeAction = withAction(subscribeToGameUpdates, 'subscribe');

// routes
const withRoutes = withRouter(toEnd, toGame);

// effects
const withSubscribeEffect = WrappedComponent => {
  return props => {
    useEffect(() => {
      const uid = resolve('fullState.gameUid', props);
      const previousGame = resolve('fullState.game', props);
      const playerUid = resolve('fullState.playerUid', props);

      if (uid && getCurrentUrl().match(IN_PROGRESS_URL_REGEX)) {
        props.subscribe(uid, previousGame, playerUid);
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

const withAutoRouterEffect = WrappedComponent => {
  return props => {
    const {
      routes: [toEnd, toGame]
    } = props;
    const gameState = resolve('fullState.game.state', props);
    const currentUrl = getCurrentUrl();

    useEffect(() => {
      if (
        gameState === GAME_STATE.END_GAME &&
        !currentUrl.endsWith('/end') &&
        currentUrl !== '/'
      ) {
        toEnd();
      }

      if (
        gameState === GAME_STATE.STARTED &&
        (currentUrl.endsWith('/topics') || currentUrl.endsWith('/players')) &&
        currentUrl !== '/'
      ) {
        toGame();
      }
    }, [currentUrl, gameState, toEnd, toGame]);

    return <WrappedComponent {...props} />;
  };
};

const wrappers = compose(
  withCoachmarkContentState,
  withFullState,
  withThemeState,
  withSubscribeAction,
  withRoutes,
  withSubscribeEffect,
  withAutoRouterEffect
);

export { App };
export default wrappers(App);
