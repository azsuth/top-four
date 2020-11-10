import { h } from 'preact';

import withThemeColor from 'components/shared/with_theme_color';

function IconX({ themeColor, white }) {
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
        d="M5.13388 3.36612C4.64573 2.87796 3.85427 2.87796 3.36612 3.36612C2.87796 3.85427 2.87796 4.64573 3.36612 5.13388L10.266 12.0338L3.36612 18.9337C2.87796 19.4218 2.87796 20.2133 3.36612 20.7014C3.85427 21.1896 4.64573 21.1896 5.13388 20.7014L12.0338 13.8015L18.9337 20.7014C19.4218 21.1896 20.2133 21.1896 20.7014 20.7014C21.1896 20.2133 21.1896 19.4218 20.7014 18.9337L13.8015 12.0338L20.7014 5.13388C21.1896 4.64573 21.1896 3.85427 20.7014 3.36612C20.2133 2.87796 19.4218 2.87796 18.9337 3.36612L12.0338 10.266L5.13388 3.36612Z"
        fill={white ? '#fff' : themeColor}
      />
    </svg>
  );
}

export default withThemeColor(IconX);
