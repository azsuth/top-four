import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Router, getCurrentUrl } from 'preact-router';

import { withAction, withState } from 'state/game';
import { saveState } from 'utilities/local_storage';
import compose from 'utilities/compose';
import resolve from 'utilities/resolve';
import { subscribeToGameUpdates } from 'actions/game';
import { IN_PROGRESS_URL_REGEX } from 'utilities/constants';

// Code-splitting is automated for routes
import Home from 'routes/home';
import Join from 'routes/join';
import Create from 'routes/create';
import Share from 'routes/share';
import Teams from 'routes/teams';
import AddTopics from 'routes/add_topics';
import Game from 'routes/game';

const App = () => {
  return (
    <div id="app">
      <Router>
        <Home path="/" />
        <Join path="/join" />
        <Create path="/create" />
        <Share path="/:routeGameId/share" />
        <Teams path="/:routeGameId/teams" />
        <AddTopics path="/:routeGameId/topics" />
        <Game path="/:routeGameId/game" />
      </Router>
    </div>
  );
};

const withSubscribeAction = withAction(subscribeToGameUpdates, 'subscribe');
const withFullState = withState(null, 'fullState');

const withSubscribeEffect = WrappedComponent => {
  return props => {
    useEffect(() => {
      const uid = resolve('fullState.gameUid', props);

      if (uid && getCurrentUrl().match(IN_PROGRESS_URL_REGEX)) {
        props.subscribe(uid);
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

const withLocaStorageEffect = WrappedComponent => {
  return props => {
    const writeStateToLocalStorage = () => {
      saveState(props.fullState);
    };

    useEffect(() => {
      window.addEventListener('pagehide', writeStateToLocalStorage);
      window.addEventListener('beforeunload', writeStateToLocalStorage);

      return () => {
        window.removeEventListener('pagehide', writeStateToLocalStorage);
        window.removeEventListener('beforeunload', writeStateToLocalStorage);
      };
    }, [props.fullState]);

    return <WrappedComponent {...props} />;
  };
};

const wrappers = compose(
  withSubscribeAction,
  withFullState,
  withSubscribeEffect,
  withLocaStorageEffect
);

export { App };
export default wrappers(App);
