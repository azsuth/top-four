import { h } from 'preact';

import withThemeColor from 'components/shared/with_theme_color';

function IconTwitter({ themeColor, white }) {
  return (
    <svg
      width="27"
      height="22"
      viewBox="0 0 27 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.8022 4.38479C25.6632 4.85264 25.0695 6.04081 24.0556 7.1705C23.3796 19.5443 10.7864 23.5738 2.16655 19.4231C0.982151 17.9311 6.43459 18.5359 8.42055 15.6746C0.898405 12.0073 1.48911 2.21242 3.01149 2.61609C6.5602 7.1705 12.2654 7.57274 13.1955 7.1705C13.1955 6.12212 12.7305 3.86559 15.3086 1.96994C16.7876 0.962918 19.8802 0.0614492 22.6842 2.95842C23.1628 3.25796 23.8507 3.39204 24.8796 3.16952C25.4882 2.86998 26.3047 3.07681 25.8845 4.11663"
        stroke={white ? '#fff' : themeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default withThemeColor(IconTwitter);
