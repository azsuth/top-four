import { h } from 'preact';
import { useState } from 'preact/hooks';
import SwipeableViews from 'react-swipeable-views';

import compose from 'utilities/compose';
import cx from 'utilities/cx';
import generateSuperlatives from 'utilities/superlatives';

import { withState } from '@state';

import Button from 'components/shared/button';
import Logo from 'components/shared/logo';

import Superlative from 'components/end/superlative';
import FinalScores from 'components/end/final_scores';
import NewGame from 'components/end/new_game';

function End({ gameData }) {
  const [step, setStep] = useState(0);
  const superlatives = generateSuperlatives(gameData);

  return (
    <div class="end flex direction--column height--100-pct bg-color--primary">
      <div class="margin-t--xlarge">
        <Logo size="small" />
      </div>
      <SwipeableViews
        containerStyle={{ flexGrow: 1 }}
        index={step}
        onChangeIndex={setStep}
        slideStyle={{ display: 'flex', flexDirection: 'column' }}
        style={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}
      >
        {superlatives.map(superlative => (
          <Superlative superlative={superlative} />
        ))}
        <FinalScores />
        <NewGame />
      </SwipeableViews>
      <div class="flex justify--between margin-h--large margin-b--large">
        <div class={cx({ 'visibility--hidden': step === 0 })}>
          <Button
            variant="text-invert"
            onClick={() => setStep(prevStep => prevStep - 1)}
          >
            &lt; Back
          </Button>
        </div>
        <div
          class={cx({
            'visibility--hidden': step === 1 + superlatives.length
          })}
        >
          <Button
            variant="text-invert"
            onClick={() => setStep(prevStep => prevStep + 1)}
          >
            Next &gt;
          </Button>
        </div>
      </div>
    </div>
  );
}

// state
const withGameData = withState('game', 'gameData');

const wrappers = compose(withGameData);

export default wrappers(End);
