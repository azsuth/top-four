import { h } from 'preact';

import { withAction } from '@state';
import { showCoachmark } from '@actions';

import IconCircleI from 'components/shared/icon/icon_circle_i';

const Coachmark = ({ children, showCoachmark, white }) => {
  return (
    <div class="coachmark" onClick={() => showCoachmark(children)}>
      <IconCircleI white={white} />
    </div>
  );
};

const withShowCoachmarkAction = withAction(showCoachmark, 'showCoachmark');

export { Coachmark };
export default withShowCoachmarkAction(Coachmark);
