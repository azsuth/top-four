import { h } from 'preact';

import Loading from 'components/shared/loading';

function Creating() {
  return (
    <div class="flex direction--column align-items--center">
      <h1 class="modal-header color--primary-darkest margin-b--large">
        Creating game...
      </h1>
      <div class="margin-v--xlarge">
        <Loading />
      </div>
    </div>
  );
}

export default Creating;
