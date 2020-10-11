import { h } from 'preact';

import { withAction } from '@state';
import { showCoachmark } from '@actions';
import { logEvent } from '@services/logger';

import IconCircleI from 'components/shared/icon/icon_circle_i';

const Coachmark = ({ children, showCoachmark, eventLabel, white }) => {
  const handleShowCoachmark = () => {
    showCoachmark(children);

    logEvent('coachmark', 'show_coachmark', eventLabel);
  };

  return (
    <div class="coachmark" onClick={handleShowCoachmark}>
      <IconCircleI white={white} />
    </div>
  );
};

const withShowCoachmarkAction = withAction(showCoachmark, 'showCoachmark');

export { Coachmark };
export default withShowCoachmarkAction(Coachmark);
