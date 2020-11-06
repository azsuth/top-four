import { h } from 'preact';

import Button from 'components/shared/button';
import IconInstagram from 'components/shared/icon/icon_instagram';
import IconTwitter from 'components/shared/icon/icon_twitter';

function Social({ whiteBackground }) {
  return (
    <div class="flex direction--column justify--center align-items--center margin-t--base">
      <div class="width--15">
        <Button
          href="mailto:feedback@topfour.io"
          fullWidth
          link
          variant={whiteBackground ? 'secondary' : 'secondary-invert'}
        >
          Send Us Feedback
        </Button>
      </div>
      <div class="flex align-items--center margin-t--large">
        <a
          class="margin-r--base"
          href="https://instagram.com/topfour.io"
          target="_blank"
        >
          <IconInstagram white={!whiteBackground} />
        </a>
        <a
          class="margin-l--base"
          href="https://twitter.com/TopFourGame"
          target="_blank"
        >
          <IconTwitter white={!whiteBackground} />
        </a>
      </div>
    </div>
  );
}

export default Social;
