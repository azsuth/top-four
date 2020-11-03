import { h } from 'preact';

import compose from 'utilities/compose';
import { toRankingPlayer } from 'utilities/state_mapping';
import { withState } from '@state';

import { headerState } from 'components/game/game_state_helpers';

import IconChevronUp from 'components/shared/icon/icon_chevron_up';

const Header = ({ header, hideInfo, showInfo, subheader }) => {
  return (
    <div class="game-header text-align--center">
      {showInfo && (
        <div onClick={hideInfo}>
          <IconChevronUp />
        </div>
      )}
      <h1 class="modal-header color--primary-darkest margin-b--xs">{header}</h1>
      <span class="font-weight--bold">{subheader}</span>
    </div>
  );
};

// state
const withRankingPlayerState = withState(
  'game',
  'rankingPlayer',
  toRankingPlayer
);

const withProps = WrappedComponent => {
  return props => {
    const { header, subheader } = headerState(props);

    return (
      <WrappedComponent {...props} header={header} subheader={subheader} />
    );
  };
};

const wrappers = compose(withRankingPlayerState, withProps);

export { Header };
export default wrappers(Header);
