import { h } from 'preact';
import { useState } from 'preact/hooks';

import Button from 'components/shared/button';
import RadioInput from 'components/shared/radio_input';
import TextInput from 'components/shared/text_input';

function renderButtons() {
  const [buttonClicks, setButtonClicks] = useState(0);
  const buttonClicked = () => {
    setButtonClicks(prev => prev + 1);
  };

  return (
    <>
      <h2 class="color--dark-gray font-size--large font-weight--bold">
        Buttons
      </h2>
      <span>Button clicks: {buttonClicks}</span>
      <div class="storybook flex direction--column padding--base">
        <Button onClick={buttonClicked} variant="primary">
          BUTTON
        </Button>
        <Button onClick={buttonClicked} variant="primary" disabled>
          BUTTON
        </Button>
        <Button onClick={buttonClicked} variant="secondary">
          BUTTON
        </Button>
        <Button onClick={buttonClicked} variant="secondary" disabled>
          BUTTON
        </Button>
      </div>
      <div class="storybook bg-color--primary flex direction--column padding--base">
        <Button onClick={buttonClicked} variant="primary-invert">
          BUTTON
        </Button>
        <Button onClick={buttonClicked} variant="primary-invert" disabled>
          BUTTON
        </Button>
        <Button onClick={buttonClicked} variant="secondary-invert">
          BUTTON
        </Button>
        <Button onClick={buttonClicked} variant="secondary-invert" disabled>
          BUTTON
        </Button>
      </div>
      <div class="storybook flex direction--column padding--base">
        <Button onClick={buttonClicked} variant="text">
          BUTTON
        </Button>
        <Button onClick={buttonClicked} variant="text" disabled>
          BUTTON
        </Button>
      </div>
      <div class="storybook bg-color--primary flex direction--column padding--base">
        <Button onClick={buttonClicked} variant="text-invert">
          BUTTON
        </Button>
        <Button onClick={buttonClicked} variant="text-invert" disabled>
          BUTTON
        </Button>
      </div>
    </>
  );
}

function renderTextInputs() {
  const [firstText, setFirstText] = useState('');
  const [secondText, setSecondText] = useState('');
  const [thirdText, setThirdText] = useState('');

  return (
    <>
      <h2 class="color--dark-gray font-size--large font-weight--bold">
        Text Inputs
      </h2>
      <TextInput
        label="Label"
        name="first"
        onChange={setFirstText}
        placeholder="Placeholder"
        value={firstText}
      />
      <span>Text: {firstText}</span>
      <TextInput
        name="second"
        onChange={setSecondText}
        placeholder="Placeholder"
        value={secondText}
      />
      <span>Text: {secondText}</span>
      <TextInput name="third" onChange={setThirdText} value={thirdText} />
      <span>Text: {thirdText}</span>
    </>
  );
}

function renderRadioInputs() {
  const [radioId, setRadioId] = useState('radio1');

  return (
    <>
      <h2 class="color--dark-gray font-size--large font-weight--bold">
        Radio Inputs
      </h2>
      <RadioInput
        checked={radioId === 'radio1'}
        label="Choice 1"
        name="radio1"
        onChange={() => setRadioId('radio1')}
        value="1"
      />
      <RadioInput
        checked={radioId === 'radio2'}
        label="Choice 2"
        name="radio2"
        onChange={() => setRadioId('radio2')}
        value="2"
      />
      <RadioInput
        checked={radioId === 'radio3'}
        disabled
        label="Disabled Choice"
        name="radio3"
        onChange={() => setRadioId('radio3')}
        value="3"
      />
    </>
  );
}

function renderThemes(setTheme) {
  return (
    <>
      <h2 class="color--dark-gray font-size--large font-weight--bold">
        Themes
      </h2>
      <div class="flex justify--between">
        <Button onClick={() => setTheme('orange')} variant="primary">
          ORANGE
        </Button>
        <Button onClick={() => setTheme('purple')} variant="primary">
          PURPLE
        </Button>
        <Button onClick={() => setTheme('green')} variant="primary">
          GREEN
        </Button>
      </div>
    </>
  );
}

function Storybook() {
  const [theme, setTheme] = useState('orange');

  return (
    <div class={`height--100-pct overflow--hidden theme-${theme}`}>
      <div class="storybook flex direction--column height--100-pct padding--base overflow-y--auto">
        <h1 class="color--dark-gray font-size--xlarge font-weight--bold">
          Top Four Components
        </h1>
        {renderThemes(setTheme)}
        {renderRadioInputs()}
        {renderTextInputs()}
        {renderButtons()}
      </div>
    </div>
  );
}

export default Storybook;
