import { h } from 'preact';

import compose from 'utilities/compose';
import { isDesktop } from 'utilities/device';
import { toGameTurn, toRemainingTurns } from 'utilities/state_mapping';
import { withState } from '@state';

import Button from 'components/shared/button';
import Logo from 'components/shared/logo';
import IconTrophy from 'components/shared/icon/icon_trophy';
import Social from 'components/shared/social';

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
      const { top, bottom } = el.getBoundingClientRect();
      const newTopicsTop = top + bottom;

      if (newTopicsTop !== topicsTop) {
        setTopicsTop(newTopicsTop);
      }
    }
  };

  return (
    <div class="info flex direction--column align-items--center height--100-pct bg-color--primary padding-b--xlarge-x2">
      <div
        class="flex justify--center align-items--center margin-v--xlarge md:margin-v--5 lg:margin-v--5 padding-h--large width--100-pct lg:max-width--45-pct"
        ref={handleHeaderRef}
      >
        <span class="color--white font-weight--bold font-size--base">
          {gameId}
        </span>
        <span class="flex-grow--1 md:flex-grow--0 lg:flex-grow--0 margin-h--xlarge">
          <Logo size={isDesktop() ? 'med' : 'small'} />
        </span>
        {showInfo && (
          <Button name="hide-info" onClick={toggleShowInfo} variant="icon">
            <IconX white />
          </Button>
        )}
        {!showInfo && (
          <Button name="show-info" onClick={toggleShowInfo} variant="icon">
            <IconTrophy white />
          </Button>
        )}
      </div>
      <div class="flex direction--column md:justify--center lg:justify--center align-items--stretch height--100-pct width--100-pct md:width--33-pct lg:width--33-pct">
        <div class="flex justify--between align-items--center padding-h--base">
          <span class="color--white font-weight--bold font-size--base">
            Turns Played: {gameTurn}
          </span>
          <span class="color--white font-weight--bold font-size--base">
            Turns Remaining: {remainingTurns}
          </span>
        </div>
        <Players />
        <Social />
      </div>
    </div>
  );
}

const withGameIdState = withState('gameId');
const withGameTurnState = withState('game.topics', 'gameTurn', toGameTurn);
const withRemainingTurnsState = withState(
  'game',
  'remainingTurns',
  toRemainingTurns
);

const wrappers = compose(
  withGameIdState,
  withGameTurnState,
  withRemainingTurnsState
);

export default wrappers(Info);
