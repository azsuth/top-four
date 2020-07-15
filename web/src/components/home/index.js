import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Button } from '@material-ui/core';

import withRouter, { toJoin, toCreate } from 'utilities/router';
import { withAction } from '@state';
import { clearState, showCoachmark } from '@actions';

import Logo from 'components/shared/logo';
import Instructions from 'components/home/instructions';
import { logEvent } from '@services/logger';

const Home = ({ clearState, routes: [toJoin, toCreate], showCoachmark }) => {
  useEffect(() => {
    clearState();
  }, []);

  const handleClickInstructions = () => {
    showCoachmark(<Instructions />);

    logEvent('coachmark', 'show_coachmark', 'instructions');
  };

  return (
    <div class="home">
      <div class="home__header">
        <Logo />
      </div>
      <div class="home__buttons">
        <Button
          className="home__main-button"
          variant="contained"
          disableElevation
          onClick={toJoin}
        >
          Join an existing game
        </Button>
        <span class="home__separator">or</span>
        <Button
          className="home__main-button"
          variant="contained"
          disableElevation
          onClick={toCreate}
        >
          Start a new game
        </Button>
        <span class="home__separator" />
        <Button
          className="home__secondary-button"
          variant="outlined"
          onClick={handleClickInstructions}
        >
          How to play
        </Button>
      </div>
    </div>
  );
};

// actions
const withClearStateAction = withAction(clearState, 'clearState');
const withShowCoackmarkAction = withAction(showCoachmark, 'showCoachmark');

// routes
const withRoutes = withRouter(toJoin, toCreate);

export { Home };
export default withClearStateAction(withShowCoackmarkAction(withRoutes(Home)));
