import { h } from 'preact';

import Button from 'components/shared/button';

function Share({ gameId }) {
  return (
    <div class="flex flex-grow--1 direction--column align-items--center">
      <h1 class="modal-header color--primary margin-b--large">Success!</h1>
      <h2 class="modal-header margin-b--xs">Your Game ID is</h2>
      <span class="font-weight--bold color--primary font-size--huge margin-b--xs">
        {gameId}
      </span>
      <p class="text-align--center margin-h--xlarge font-size--base">
        Share this ID with your friends so they can join your game
      </p>
      <div class="flex-grow--1" />
      <div class="margin-b--large width--75-pct">
        <Button fullWidth variant="primary">
          Add Topics
        </Button>
      </div>
    </div>
  );
}

export default Share;
