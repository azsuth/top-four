import { h } from 'preact';

import withThemeColor from 'components/shared/with_theme_color';

function IconInstagram({ themeColor, white }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="6"
        stroke={white ? '#fff' : themeColor}
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="5"
        stroke={white ? '#fff' : themeColor}
        strokeWidth="2"
      />
      <circle
        cx="18.25"
        cy="5.75"
        r="1.25"
        fill={white ? '#fff' : themeColor}
      />
    </svg>
  );
}

export default withThemeColor(IconInstagram);
