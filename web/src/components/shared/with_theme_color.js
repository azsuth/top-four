import { h } from 'preact';

import variables from '../../style/_themes.scss';
// import variables from 'style/_themes';
import { withState } from '@state';

function withThemeColor(WrappedComponent) {
  function ThemeColorProvider(props) {
    const { theme } = props;
    const titleCaseTheme = theme.charAt(0).toUpperCase() + theme.substr(1);

    const themeColor = variables[`color${titleCaseTheme}`];

    return <WrappedComponent {...props} themeColor={themeColor} />;
  }

  const withThemeState = withState('theme');

  return withThemeState(ThemeColorProvider);
}

export default withThemeColor;
