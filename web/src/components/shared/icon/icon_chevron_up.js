import { h } from 'preact';

import withThemeColor from 'components/shared/with_theme_color';

function IconChevronUp({ themeColor, white }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.5607 18.0607C21.9749 18.6464 21.0251 18.6464 20.4393 18.0607L12 9.62132L3.56066 18.0607C2.97487 18.6464 2.02513 18.6464 1.43934 18.0607C0.853554 17.4749 0.853554 16.5251 1.43934 15.9393L10.9393 6.43934C11.5251 5.85355 12.4749 5.85355 13.0607 6.43934L22.5607 15.9393C23.1464 16.5251 23.1464 17.4749 22.5607 18.0607Z"
        fill={white ? '#fff' : themeColor}
      />
    </svg>
  );
}

export default withThemeColor(IconChevronUp);
