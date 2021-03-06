import { route } from 'preact-router';

import { withState } from '@state';

const toRoot = () => () => {
  route('/', true);
};

const toJoin = () => () => {
  route('/join');
};

const toCreate = () => () => {
  route('/create');
};

const toPlayers = gameId => () => {
  route(`/${gameId}/players`, true);
};

const toAddTopics = gameId => () => {
  route(`/${gameId}/topics`, true);
};

const toGame = gameId => () => {
  route(`/${gameId}/game`, true);
};

const toEnd = gameId => () => {
  route(`/${gameId}/end`, true);
};

const withRouter = (...routeFns) => {
  return WrappedComponent => {
    const Component = props => {
      const { gameId } = props;

      const routes = routeFns.map(routeFn => routeFn(gameId));

      return <WrappedComponent {...props} routes={routes} />;
    };

    const withGameIdState = withState('gameId');

    return withGameIdState(Component);
  };
};

export { toRoot, toJoin, toCreate, toPlayers, toAddTopics, toGame, toEnd };
export default withRouter;
