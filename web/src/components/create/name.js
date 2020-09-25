import { h } from 'preact';

import Button from 'components/shared/button';
import TextInput from 'components/shared/text_input';

const Name = ({ name, setName, loading, onStartGame }) => {
  const disabled = loading || !name;

  return (
    <div class="name flex-grow--1 width--100-pct flex direction--column align-items--center">
      <h1 class="modal-header color--primary margin-b--large">
        What's your name?
      </h1>
      <form autoComplete="off" class="flex direction--column flex-grow--1">
        <div class="flex-grow--1 margin-b--xlarge">
          <TextInput
            label="Your name"
            name="name"
            onChange={setName}
            placeholder=""
            value={name}
          />
        </div>

        <div class="margin-b--large">
          <Button
            disabled={disabled}
            fullWidth
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
