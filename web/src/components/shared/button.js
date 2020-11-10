import { h } from 'preact';

import cx from 'utilities/cx';

function Button({
  children,
  disabled,
  fullWidth,
  href,
  link,
  name,
  onClick,
  variant = 'primary'
}) {
  const Component = link ? 'a' : 'button';

  const classes = cx('btn', `btn--${variant}`, { 'width--100-pct': fullWidth });

  return (
    <Component
      class={classes}
      disabled={disabled}
      href={href}
      name={name}
      onClick={onClick}
      target={link ? '_blank' : undefined}
    >
      {children}
    </Component>
  );
}

export default Button;
