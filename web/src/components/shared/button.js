import { h } from 'preact';

import cx from 'utilities/cx';

function Button({ children, disabled, onClick, variant }) {
  const classes = cx('btn', `btn--${variant}`);

  return (
    <button class={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
