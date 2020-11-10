import { h } from 'preact';

import withThemeColor from 'components/shared/with_theme_color';

function IconArrowLeft({ themeColor, white }) {
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
        d="M11.5696 17.546C11.6168 17.6598 11.6861 17.7633 11.7734 17.8504C11.8605 17.9376 11.9639 18.0069 12.0778 18.0542C12.1917 18.1014 12.3137 18.1257 12.437 18.1257C12.5603 18.1257 12.6824 18.1014 12.7963 18.0542C12.9102 18.0069 13.0136 17.9376 13.1007 17.8504L18.7248 12.2263C18.8121 12.1392 18.8813 12.0358 18.9286 11.9219C18.9758 11.808 19.0002 11.6859 19.0002 11.5626C19.0002 11.4393 18.9758 11.3172 18.9286 11.2034C18.8813 11.0895 18.8121 10.986 18.7248 10.899L13.1007 5.27489C13.0135 5.18774 12.9101 5.1186 12.7962 5.07144C12.6823 5.02427 12.5603 5 12.437 5C12.3138 5 12.1917 5.02427 12.0779 5.07144C11.964 5.1186 11.8605 5.18773 11.7734 5.27489C11.6862 5.36204 11.6171 5.4655 11.5699 5.57937C11.5228 5.69324 11.4985 5.81528 11.4985 5.93853C11.4985 6.06178 11.5228 6.18382 11.5699 6.29769C11.6171 6.41156 11.6862 6.51502 11.7734 6.60217L15.7981 10.6254L4.93733 10.6254C4.68873 10.6254 4.45032 10.7241 4.27453 10.8999C4.09874 11.0757 3.99999 11.3141 3.99999 11.5627C3.99999 11.8113 4.09874 12.0497 4.27453 12.2255C4.45032 12.4013 4.68873 12.5001 4.93733 12.5001L15.7979 12.5001L11.7734 16.5231C11.6861 16.6101 11.6168 16.7136 11.5696 16.8275C11.5223 16.9413 11.498 17.0634 11.498 17.1867C11.498 17.31 11.5223 17.4321 11.5696 17.546Z"
        fill={white ? '#fff' : themeColor}
      />
    </svg>
  );
}

export default withThemeColor(IconArrowLeft);