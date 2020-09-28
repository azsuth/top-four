import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import SwipeableViews from 'react-swipeable-views';

import cx from 'utilities/cx';
import compose from 'utilities/compose';
import { WRITE_OUR_OWN_UID, INDIVIDUALS } from 'utilities/constants';

import { withAction, withState } from '@state';
import { getTopicPacks, startGame } from '@actions';

import Button from 'components/shared/button';
import Logo from 'components/shared/logo';

import GameMode from 'components/create/game_mode';
import Topics from 'components/create/topics';
import Name from 'components/create/name';
import Creating from 'components/create/creating';

function CreateContainer({ children }) {
  return (
    <div class="container flex-grow--1 flex direction--column align-items--center margin--large padding-t--large padding-h--s padding-b--s">
      {children}
    </div>
  );
}

const Create = ({ topicPacks, startGame }) => {
  const [gameMode, setGameMode] = useState(INDIVIDUALS);
  const [topicPackUid, setTopicPackUid] = useState(WRITE_OUR_OWN_UID);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [focused, setFocused] = useState(false);

  const handleStartGame = () => {
    setLoading(true);

    startGame({ name, gameMode, topicPackUid }).catch(() => {
      setLoading(false);
    });
  };

  return (
    <div class="create flex direction--column height--100-pct bg-color--primary">
      <div class="margin-t--xlarge">
        <Logo size="small" />
      </div>
      <SwipeableViews
        containerStyle={{ flexGrow: 1 }}
        index={step}
        slideStyle={{ display: 'flex', flexDirection: 'column' }}
        style={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}
      >
        <CreateContainer>
          <GameMode gameMode={gameMode} setGameMode={setGameMode} />
        </CreateContainer>
        <CreateContainer>
          <Topics
            topicPacks={topicPacks}
            topicPackUid={topicPackUid}
            setTopicPackUid={setTopicPackUid}
          />
        </CreateContainer>
        <CreateContainer>
          {!loading && (
            <Name
              focused={focused}
              loading={loading}
              name={name}
              onBlur={() => setFocused(false)}
              onFocus={() => setFocused(true)}
              onStartGame={handleStartGame}
              setName={setName}
            />
          )}
          {loading && <Creating />}
        </CreateContainer>
      </SwipeableViews>
      {!focused && (
        <div class="flex justify--between margin-h--large margin-b--large">
          <div
            class={cx({
              'visibility--hidden': loading || step === 0
            })}
          >
            <Button
              onClick={() => setStep(prevStep => prevStep - 1)}
              variant="text-invert"
            >
              &lt; Back
            </Button>
          </div>
          <div
            class={cx({
              'visibility--hidden': loading || step === 2
            })}
          >
            <Button
              onClick={() => setStep(prevStep => prevStep + 1)}
              variant="text-invert"
            >
              Next &gt;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// state
const withTopicPacksState = withState('topicPacks');

// actions
const withStartGameAction = withAction(startGame, 'startGame');
const withGetTopicPacksAction = withAction(getTopicPacks, 'getTopicPacks');

// effects
const withEffect = WrappedComponent => {
  return props => {
    const { getTopicPacks } = props;

    useEffect(() => {
      getTopicPacks();
    }, []);

    return <WrappedComponent {...props} />;
  };
};

const wrappers = compose(
  withStartGameAction,
  withGetTopicPacksAction,
  withTopicPacksState,
  withEffect
);

export { Create };
export default wrappers(Create);
