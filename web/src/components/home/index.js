import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import cx from 'utilities/cx';
import withRouter, { toJoin, toCreate } from 'utilities/router';
import { withAction } from '@state';
import { clearState, showCoachmark, cycleTheme } from '@actions';

import Button from 'components/shared/button';
import Logo from 'components/shared/logo';

import Instructions from 'components/home/instructions';

const Home = ({
  clearState,
  cycleTheme,
  routes: [toJoin, toCreate],
  showCoachmark
}) => {
  const [anim, setAnim] = useState(false);
  useEffect(() => {
    clearState();

    setTimeout(() => setAnim(true), 500);
  }, []);

  const logoClasses = cx('home__logo', { 'home__logo--anim': anim });
  const logoButtonClasses = cx('home__logo-button', {
    'home__logo-button--anim': anim
  });
  const actionClasses = cx('home__actions margin-b--base width--66-pct', {
    'home__actions--anim': anim
  });

  return (
    <div class="home height--100-pct bg-color--primary">
      <div class={logoClasses}>
        <Logo />
        <span class={logoButtonClasses}>
          <Button variant="text-invert" onClick={() => cycleTheme()}>
            Click Me
          </Button>
        </span>
      </div>
      <div class={actionClasses}>
        <div class="margin-b--base">
          <Button
            fullWidth
            name="join-game"
            onClick={toJoin}
            variant="primary-invert"
          >
            JOIN A GAME
          </Button>
        </div>
        <div class="margin-b--base">
          <Button
            fullWidth
            name="start-game"
            onClick={toCreate}
            variant="primary-invert"
          >
            START A GAME
          </Button>
        </div>
        <div class="margin-b--base padding-t--base">
          <Button
            fullWidth
            name="home-instructions"
            onClick={() => showCoachmark(<Instructions />)}
            variant="secondary-invert"
          >
            HOW TO PLAY
          </Button>
        </div>
      </div>
    </div>
  );
};

// actions
const withClearStateAction = withAction(clearState, 'clearState');
const withShowCoackmarkAction = withAction(showCoachmark, 'showCoachmark');
const withCycleThemeAction = withAction(cycleTheme, 'cycleTheme');

// routes
const withRoutes = withRouter(toJoin, toCreate);

export { Home };
export default withClearStateAction(
  withShowCoackmarkAction(withCycleThemeAction(withRoutes(Home)))
);
