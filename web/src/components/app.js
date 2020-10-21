import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Router, getCurrentUrl } from 'preact-router';

import { GAME_STATE, IN_PROGRESS_URL_REGEX } from 'utilities/constants';
import compose from 'utilities/compose';
import resolve from 'utilities/resolve';
import cx from 'utilities/cx';
import withRouter, { toAddTopics, toEnd, toGame } from 'utilities/router';

import { withAction, withState } from '@state';
import { subscribeToGameUpdates } from '@actions';

import ErrorBoundary from 'components/error_boundary';

// Code-splitting is automated for routes
import Home from 'routes/home';
import Join from 'routes/join';
import Create from 'routes/create';
import Share from 'routes/share';
import Teams from 'routes/teams';
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
    <div id="app" class={`theme-${theme || 'orange'}`}>
      <ErrorBoundary>
        <div class={appContentClass}>
          <Router>
            <Home path="/" />
            <Join path="/join" />
            <Create path="/create" />
            <Share path="/:routeGameId/share" />
            <Teams path="/:routeGameId/teams" />
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
const withRoutes = withRouter(toEnd, toAddTopics, toGame);

// effects
const withSubscribeEffect = WrappedComponent => {
  return props => {
    useEffect(() => {
      const uid = resolve('fullState.gameUid', props);
      const previousGame = resolve('fullState.game', props);

      if (uid && getCurrentUrl().match(IN_PROGRESS_URL_REGEX)) {
        props.subscribe(uid, previousGame);
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

const withAutoRouterEffect = WrappedComponent => {
  return props => {
    const {
      routes: [toEnd, toAddTopics, toGame]
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
        gameState === GAME_STATE.ADD_MORE_TOPICS &&
        currentUrl.endsWith('/end')
      ) {
        toAddTopics();
      }

      if (
        gameState === GAME_STATE.ANOTHER_ROUND &&
        currentUrl.endsWith('/end')
      ) {
        toGame();
      }
    }, [currentUrl, gameState, toEnd]);

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
