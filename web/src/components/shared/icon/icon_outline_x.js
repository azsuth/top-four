import { h } from 'preact';

import withThemeColor from 'components/shared/with_theme_color';

function IconX({ themeColor }) {
  return (
    <svg
      width="52"
      height="48"
      viewBox="0 0 52 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M39.3291 3.0615C35.3798 1.03872 30.9367 0 26 0C21.0633 0 16.5654 1.03872 12.6161 3.0615C8.66668 5.13895 5.59494 7.98178 3.346 11.6446C1.09705 15.3075 0 19.4077 0 24C0 28.5923 1.09705 32.6925 3.346 36.3554C5.59494 40.0182 8.66668 42.861 12.6161 44.9385C16.5654 47.0159 21.0084 48 26 48C30.9916 48 35.4346 46.9613 39.384 44.9385C43.3333 42.861 46.4051 40.0182 48.654 36.3554C50.903 32.6925 52 28.5923 52 24C52 19.4077 50.903 15.3075 48.654 11.6446C46.4051 7.98178 43.2785 5.13895 39.3291 3.0615ZM38.5063 32.4191L34.7215 36.1913L26 27.4989L17.2785 36.1913L13.4937 32.4191L22.2152 23.7267L13.4937 15.0342L17.2785 11.262L26 19.9544L34.7215 11.262L38.5063 15.0342L29.7848 23.7267L38.5063 32.4191Z"
        fill={themeColor}
      />
    </svg>
  );
}

export default withThemeColor(IconX);