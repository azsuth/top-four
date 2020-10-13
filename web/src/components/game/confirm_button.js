import { h } from 'preact';
import { useState } from 'preact/hooks';

import cx from 'utilities/cx';

import Button from 'components/shared/button';
import IconCheck from 'components/shared/icon/icon_check';
import IconX from 'components/shared/icon/icon_x';

const ConfirmButton = ({ confirmText, confirmAction, helperText }) => {
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

  const handleConfirm = () => {
    setConfirming(false);
    confirmAction();
  };

  return (
    <div class="flex direction--column align-items--center width--100-pct">
      <span class={helperTextClasses}>{helperText || 'hidden_text'}</span>
      <div class={actionsClasses}>
        {confirming && (
          <span onClick={() => setConfirming(false)}>
            <IconX />
          </span>
        )}

        {!confirming && (
          <Button fullWidth onClick={() => setConfirming(true)}>
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
