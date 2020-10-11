import { h } from 'preact';

import { withState } from '@state';

import Logo from 'components/shared/logo';
import IconTrophy from 'components/shared/icon/icon_trophy';

function Info({ gameId, toggleShowInfo }) {
  return (
    <div class="info flex direction--column height--100-pct bg-color--primary">
      <div class="flex align-items--center margin-t--xlarge padding-h--base">
        <span class="color--white font-weight--bold">{gameId}</span>
        <span class="flex-grow--1">
          <Logo size="small" />
        </span>
        <div onClick={toggleShowInfo}>
          <IconTrophy white />
        </div>
      </div>
    </div>
  );
}

const withGameIdState = withState('gameId');

export default withGameIdState(Info);
