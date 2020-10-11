import { h } from 'preact';

import cx from 'utilities/cx';

function Button({
  children,
  disabled,
  fullWidth,
  name,
  onClick,
  variant = 'primary'
}) {
  const classes = cx('btn', `btn--${variant}`, { 'width--100-pct': fullWidth });

  return (
    <button class={classes} disabled={disabled} name={name} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
