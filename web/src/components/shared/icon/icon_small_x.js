import { h } from 'preact';

import withThemeColor from 'components/shared/with_theme_color';

function IconSmallX({ themeColor }) {
  return (
    <svg
      width="26"
      height="24"
      viewBox="0 0 26 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.6646 1.53075C17.6899 0.519362 15.4684 0 13 0C10.5317 0 8.28271 0.519362 6.30803 1.53075C4.33334 2.56948 2.79747 3.99089 1.673 5.82232C0.548525 7.65376 0 9.70387 0 12C0 14.2961 0.548525 16.3462 1.673 18.1777C2.79747 20.0091 4.33334 21.4305 6.30803 22.4692C8.28271 23.508 10.5042 24 13 24C15.4958 24 17.7173 23.4806 19.692 22.4692C21.6667 21.4305 23.2025 20.0091 24.327 18.1777C25.4515 16.3462 26 14.2961 26 12C26 9.70387 25.4515 7.65376 24.327 5.82232C23.2025 3.99089 21.6392 2.56948 19.6646 1.53075ZM19.2532 16.2096L17.3608 18.0957L13 13.7494L8.63925 18.0957L6.74684 16.2096L11.1076 11.8633L6.74684 7.51708L8.63925 5.63098L13 9.97722L17.3608 5.63098L19.2532 7.51708L14.8924 11.8633L19.2532 16.2096Z"
        fill={themeColor}
      />
    </svg>
  );
}

export default withThemeColor(IconSmallX);
