import { h } from 'preact';
import { useState } from 'preact/hooks';

import cx from 'utilities/cx';

import Button from 'components/shared/button';
import IconCheck from 'components/shared/icon/icon_check';
import IconOutlineX from 'components/shared/icon/icon_outline_x';

const ConfirmButton = ({
  confirmText,
  confirmAction,
  disabled,
  helperText,
  skipConfirm
}) => {
  const [confirming, setConfirming] = useState(false);

  const actionsClasses = cx(
    'confirm-button width--66-pct flex justify--around align-items--center margin-h--s',
    {
      'visibility--hidden': !confirmAction
    }
  );

  const helperTextClasses = cx('font-weight--bold margin-b--s', {
    'visibility--hidden': !helperText || confirming
  });

  const handleClick = () => {
    if (skipConfirm) {
      confirmAction();
    } else {
      setConfirming(true);
    }
  };

  const handleConfirm = () => {
    setConfirming(false);
    confirmAction();
  };

  return (
    <div class="flex direction--column align-items--center width--100-pct">
      <span class={helperTextClasses}>{helperText}</span>
      <div class={actionsClasses}>
        {confirming && (
          <span onClick={() => setConfirming(false)}>
            <IconOutlineX />
          </span>
        )}

        {!confirming && (
          <Button disabled={disabled} fullWidth onClick={handleClick}>
            {confirmText || ''}
          </Button>
        )}
        {confirming && <span class="font-weight--bold">You sure?</span>}

        {confirming && (
          <span onClick={handleConfirm}>
            <IconCheck />
          </span>
        )}
      </div>
    </div>
  );
};

export { ConfirmButton };
export default ConfirmButton;
