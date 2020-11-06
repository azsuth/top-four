import { h } from 'preact';

import compose from 'utilities/compose';
import withRouter, { toAddTopics, toPlayers } from 'utilities/router';

import { withAction, withState } from '@state';
import { randomizeTheme } from '@actions';

import Button from 'components/shared/button';

function Share({ gameId, nextButton }) {
  return (
    <div class="flex flex-grow--1 direction--column align-items--center">
      <h1 class="modal-header color--primary-darkest margin-b--large">
        Success!
      </h1>
      <h2 class="modal-header margin-b--xs">Your Game ID is</h2>
      <span class="font-weight--bold color--primary font-size--huge margin-b--xs">
        {gameId}
      </span>
      <p class="text-align--center margin-h--xlarge font-size--base">
        Share this ID with your friends so they can join your game
      </p>
      <div class="flex-grow--1" />
      <div class="margin-b--large width--75-pct">{nextButton}</div>
    </div>
  );
}

// state
const withTopicPackState = withState('game.topicPack', 'topicPack');

// actions
const withRandomizeThemeAction = withAction(randomizeTheme, 'randomizeTheme');

// routes
const withRoutes = withRouter(toAddTopics, toPlayers);

const withNextButton = WrappedComponent => {
  return props => {
    const {
      randomizeTheme,
      routes: [toAddTopics, toPlayers],
      topicPack
    } = props;

    let nextButton;
    if (!topicPack) {
      nextButton = (
        <Button
          fullWidth
          onClick={() => {
            toAddTopics();
            randomizeTheme();
          }}
          variant="primary"
        >
          Add Topics
        </Button>
      );
    } else {
      nextButton = (
        <Button
          fullWidth
          onClick={() => {
            toPlayers();
            randomizeTheme();
          }}
          variant="primary"
        >
          Done
        </Button>
      );
    }

    return <WrappedComponent {...props} nextButton={nextButton} />;
  };
};

const wrappers = compose(
  withTopicPackState,
  withRandomizeThemeAction,
  withRoutes,
  withNextButton
);

export default wrappers(Share);
