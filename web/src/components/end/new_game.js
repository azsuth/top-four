import { h } from 'preact';

import withRouter, { toRoot } from 'utilities/router';

import Button from 'components/shared/button';
import Social from 'components/shared/social';

function NewGame({ routes: [toRoot] }) {
  return (
    <div class="container min-height--50-pct flex direction--column justify--between align-items--center margin--base padding--large overflow--hidden">
      <h1 class="modal-header color--primary-darkest margin-b--large">
        Play again?
      </h1>
      <div class="flex direction--column align-items--center">
        <Button fullWidth onClick={toRoot}>
          Start New Game
        </Button>
        <Social whiteBackground />
      </div>
    </div>
  );
}

const withRoutes = withRouter(toRoot);

export default withRoutes(NewGame);
