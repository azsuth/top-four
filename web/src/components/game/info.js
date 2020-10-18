import { h } from 'preact';

import compose from 'utilities/compose';
import { toGameTurn, toRemainingTurns } from 'utilities/state_mapping';
import { withState } from '@state';

import Button from 'components/shared/button';
import Logo from 'components/shared/logo';
import IconTrophy from 'components/shared/icon/icon_trophy';

import Players from 'components/game/players';
import IconX from 'components/shared/icon/icon_x';

function Info({
  gameId,
  gameTurn,
  remainingTurns,
  setTopicsTop,
  showInfo,
  toggleShowInfo,
  topicsTop
}) {
  const handleHeaderRef = el => {
    if (el) {
      const { height, top } = el.getBoundingClientRect();
      const newTopicsTop = height * 2 + top;

      if (newTopicsTop !== topicsTop) {
        setTopicsTop(newTopicsTop);
      }
    }
  };

  return (
    <div class="info flex direction--column height--100-pct bg-color--primary padding-b--xlarge-x2">
      <div
        class="flex align-items--center margin-t--xlarge padding-h--base"
        ref={handleHeaderRef}
      >
        <span class="color--white font-weight--bold font-size--base">
          {gameId}
        </span>
        <span class="flex-grow--1 margin-h--xlarge">
          <Logo size="small" />
        </span>
        <div onClick={toggleShowInfo}>
          {showInfo && <IconX white />}
          {!showInfo && <IconTrophy white />}
        </div>
      </div>
      <div class="flex justify--between align-items--center margin-t--xlarge padding-h--base">
        <span class="color--white font-weight--bold font-size--base">
          Turns Played: {gameTurn}
        </span>
        <span class="color--white font-weight--bold font-size--base">
          Turns Remaining: {remainingTurns}
        </span>
      </div>
      <Players />
      <div class="flex justify--center margin-t--base">
        <div class="width--15">
          <Button
            href="mailto:feedback@topfour.io"
            fullWidth
            link
            variant="secondary-invert"
          >
            Send Us Feedback
          </Button>
        </div>
      </div>
    </div>
  );
}

const withGameIdState = withState('gameId');
const withGameTurnState = withState('game.topics', 'gameTurn', toGameTurn);
const withRemainingTurnsState = withState(
  'game.topics',
  'remainingTurns',
  toRemainingTurns
);

const wrappers = compose(
  withGameIdState,
  withGameTurnState,
  withRemainingTurnsState
);

export default wrappers(Info);
