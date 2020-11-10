import { h } from 'preact';

import withThemeColor from 'components/shared/with_theme_color';

function IconTwitter({ themeColor, white }) {
  return (
    <svg
      width="29"
      height="24"
      viewBox="0 0 29 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M27.7858 4.72327C27.6351 5.23791 26.9919 6.5449 25.8935 7.78755C25.1612 21.3987 11.5186 25.8312 2.18043 21.2654C0.89733 19.6242 6.80414 20.2894 8.9556 17.142C0.806606 13.1081 1.44654 2.33367 3.09578 2.7777C6.94022 7.78755 13.1208 8.23002 14.1285 7.78755C14.1285 6.63433 13.6247 4.15215 16.4177 2.06693C18.0199 0.95921 21.3703 -0.032406 24.4079 3.15426C24.9263 3.48375 25.6716 3.63124 26.7862 3.38647C27.4456 3.05698 28.3301 3.28449 27.8749 4.4283"
        stroke={white ? '#fff' : themeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default withThemeColor(IconTwitter);
