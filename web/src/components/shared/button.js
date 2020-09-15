import { h } from 'preact';

import cx from 'utilities/cx';

function Button({ children, disabled, fullWidth, onClick, variant }) {
  const classes = cx('btn', `btn--${variant}`, { 'width--100-pct': fullWidth });

  return (
    <button class={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
