import { h } from 'preact';

import withThemeColor from 'components/shared/with_theme_color';

function IconFacebook({ themeColor, white }) {
  return (
    <svg
      width="17"
      height="24"
      viewBox="0 0 17 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 10.775V15.4055H5.25567V23H10.0921V15.3274H14.1976L16 10.7847H13.0411H10.0821V7.73091C10.0821 7.73091 9.81175 5.57194 12.6255 5.41563H16V1C16 1 13.036 1 12.0447 1C11.1135 1 5.21562 1.29307 5.21562 7.04707V10.775H1Z"
        stroke={white ? '#fff' : themeColor}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default withThemeColor(IconFacebook);
