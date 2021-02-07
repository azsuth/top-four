import { h } from 'preact';
import { useState } from 'preact/hooks';
import SwipeableViews from 'react-swipeable-views';

import compose from 'utilities/compose';
import { isDesktop } from 'utilities/device';
import cx from 'utilities/cx';
import generateSuperlatives from 'utilities/superlatives';

import { withState } from '@state';

import Button from 'components/shared/button';
import Logo from 'components/shared/logo';
import IconArrowRight from 'components/shared/icon/icon_arrow_right';
import IconArrowLeft from 'components/shared/icon/icon_arrow_left';

import Superlative from 'components/end/superlative';
import FinalScores from 'components/end/final_scores';
import NewGame from 'components/end/new_game';

function EndContainer({ children }) {
  const endContainerClasses = cx(
    'container height--50-pct flex direction--column align-items--center margin--large padding-t--large padding-h--base padding-b--s',
    'md:flex-grow--0 md:width--70-pct md:max-width--36 md:height--100-pct md:padding-b--large',
    'lg:flex-grow--0 lg:width--40-pct lg:max-width--36 lg:height--100-pct lg:padding-b--large'
  );

  return <div class={endContainerClasses}>{children}</div>;
}

function End({ gameData }) {
  const [step, setStep] = useState(0);
  const superlatives = generateSuperlatives(gameData);

  return (
    <div class="end flex direction--column height--100-pct bg-color--primary">
      <div class="margin-t--xlarge md:flex-grow--1 lg:flex-grow--1">
        <Logo size={isDesktop() ? '' : 'small'} />
      </div>
      <SwipeableViews
        containerStyle={{ flexGrow: 1 }}
        index={step}
        onChangeIndex={setStep}
        slideClassName="flex direction--column md:align-items--center lg:align-items--center"
        className="flex direction--column flex-grow--1 md:flex-grow--0 lg:flex-grow--0"
      >
        {superlatives.map(superlative => (
          <EndContainer>
            <Superlative superlative={superlative} />
          </EndContainer>
        ))}
        <EndContainer>
          <FinalScores />
        </EndContainer>
        <EndContainer>
          <NewGame />
        </EndContainer>
      </SwipeableViews>
      <div class="flex justify--between margin-h--large margin-b--large md:align-self--center md:width--70-pct md:max-width--36 lg:align-self--center lg:width--40-pct lg:max-width--36">
        <div class={cx({ 'visibility--hidden': step === 0 })}>
          <Button
            name="back"
            onClick={() => setStep(prevStep => prevStep - 1)}
            variant="text-invert"
          >
            <div class="flex align-items--center">
              <IconArrowLeft white />
              Back
            </div>
          </Button>
        </div>
        <div
          class={cx({
            'visibility--hidden': step === 1 + superlatives.length
          })}
        >
          <Button
            name="next"
            onClick={() => setStep(prevStep => prevStep + 1)}
            variant="text-invert"
          >
            <div class="flex align-items--center">
              Next
              <IconArrowRight white />
            </div>
          </Button>
        </div>
      </div>
      <div class="md:flex-grow--1 lg:flex-grow--1" />
    </div>
  );
}

// state
const withGameData = withState('game', 'gameData');

const wrappers = compose(withGameData);

export default wrappers(End);
