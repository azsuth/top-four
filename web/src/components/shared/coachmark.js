import { h } from 'preact';

import { withAction } from '@state';
import { showCoachmark } from '@actions';

import Button from './button';
import IconCircleI from 'components/shared/icon/icon_circle_i';

const Coachmark = ({ children, showCoachmark, white }) => {
  return (
    <div class="coachmark">
      <Button
        name="coachmark"
        onClick={() => showCoachmark(children)}
        variant="icon"
      >
        <IconCircleI white={white} />
      </Button>
    </div>
  );
};

const withShowCoachmarkAction = withAction(showCoachmark, 'showCoachmark');

export { Coachmark };
export default withShowCoachmarkAction(Coachmark);
