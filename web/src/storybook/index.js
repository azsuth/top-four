import { h } from 'preact';
import { useState } from 'preact/hooks';

import Button from 'components/shared/button';

function Storybook() {
  const [buttonClicks, setButtonClicks] = useState(0);
  // const buttonClicked = () => setButtonClicks(prev => prev + 1);
  const buttonClicked = () => {
    setButtonClicks(prev => prev + 1);
  };

  return (
    <div class="height--100-pct overflow--hidden">
      <div class="storybook flex direction--column height--100-pct padding--base overflow-y--auto">
        <h1 class="color--dark-gray font-size--xlarge font-weight--bold">
          Top Four Components
        </h1>
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
      </div>
    </div>
  );
}

export default Storybook;
