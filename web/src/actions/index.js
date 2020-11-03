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

const themes = [
  'orange',
  'berry',
  'fuschia',
  'purple',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'mint',
  'green',
  'lime',
  'golden'
];
let shuffled = false;

const cycleTheme = ({ dispatch, state: { theme: currentTheme } }) => {
  if (!shuffled) {
    shuffle(themes);
  }

  const index = themes.indexOf(currentTheme);
  const nextTheme = themes[(index + 1) % themes.length];

  dispatch({ type: SET_THEME, payload: nextTheme });
};

function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    const tempVal = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = tempVal;
  }
}

function randomTheme() {
  return themes[Math.floor(Math.random() * themes.length)];
}

export { showCoachmark, hideCoachmark, cycleTheme, randomTheme };

export * from '@actions/topic_packs';
export * from '@actions/pre_game';
export * from '@actions/subscribe';
export * from '@actions/in_game';
export * from '@actions/post_game';
