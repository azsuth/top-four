import { h } from 'preact';

import withRouter, { toRoot } from 'utilities/router';
import Button from 'components/shared/button';

function NewGame({ routes: [toRoot] }) {
  return (
    <div class="flex-grow--1 container flex direction--column justify--between align-items--center margin--base padding--large overflow--hidden">
      <h1 class="modal-header color--primary-darkest margin-b--large">
        Play again?
      </h1>
      <Button onClick={toRoot}>Start New Game</Button>
    </div>
  );
}

const withRoutes = withRouter(toRoot);

export default withRoutes(NewGame);
