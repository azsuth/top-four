import { SHOW_COACHMARK, HIDE_COACHMARK, SET_THEME } from 'actions/types';

const showCoachmark = (coachmarkContent, { dispatch }) => {
  dispatch({ type: SHOW_COACHMARK, payload: coachmarkContent });
};

const hideCoachmark = ({ dispatch }) => {
  dispatch({ type: HIDE_COACHMARK, payload: true });

  setTimeout(() => {
    dispatch({ type: HIDE_COACHMARK, payload: false });
  }, 250);
};

const cycleTheme = ({
  dispatch,
  state: { theme: currentTheme = 'orange' }
}) => {
  const themes = ['orange', 'purple', 'green'];
  const index = themes.indexOf(currentTheme);
  const nextTheme = themes[(index + 1) % themes.length];

  dispatch({ type: SET_THEME, payload: nextTheme });
};

export { showCoachmark, hideCoachmark, cycleTheme };

export * from '@actions/topic_packs';
export * from '@actions/pre_game';
export * from '@actions/subscribe';
export * from '@actions/in_game';
export * from '@actions/post_game';
