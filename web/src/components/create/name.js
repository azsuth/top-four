import { h } from 'preact';

import cx from 'utilities/cx';

import Button from 'components/shared/button';
import TextInput from 'components/shared/text_input';

const Name = ({
  focused,
  loading,
  name,
  onBlur,
  onFocus,
  onStartGame,
  setName
}) => {
  const disabled = loading || !name;
  const inputClasses = cx('margin-b--xlarge', {
    'flex-grow--1': !focused && !name
  });

  const handleBlur = () => {
    setTimeout(onBlur, 200);
  };

  return (
    <div class="name flex-grow--1 width--100-pct flex direction--column align-items--center">
      <h1 class="modal-header color--primary-darkest margin-b--large">
        What's your name?
      </h1>
      <form
        autoComplete="off"
        class="flex direction--column flex-grow--1 width--80-pct md:max-width--15 lg:max-width--15"
      >
        <div class={inputClasses}>
          <TextInput
            label="Your name"
            name="name"
            onBlur={handleBlur}
            onChange={setName}
            onFocus={onFocus}
            placeholder=""
            value={name}
          />
        </div>

        <div class="margin-b--large">
          <Button
            disabled={disabled}
            fullWidth
            name="create-game"
            onClick={onStartGame}
            variant="primary"
          >
            Create Game
          </Button>
        </div>
      </form>
    </div>
  );
};

export { Name };
export default Name;
