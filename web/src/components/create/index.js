import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import SwipeableViews from 'react-swipeable-views';

import cx from 'utilities/cx';
import compose from 'utilities/compose';
import { isDesktop } from 'utilities/device';
import { WRITE_OUR_OWN_UID, INDIVIDUALS } from 'utilities/constants';

import { withAction, withState } from '@state';
import { getTopicPacks, createGame } from '@actions';

import Button from 'components/shared/button';
import Logo from 'components/shared/logo';
import IconArrowRight from 'components/shared/icon/icon_arrow_right';
import IconArrowLeft from 'components/shared/icon/icon_arrow_left';

import GameMode from 'components/create/game_mode';
import Topics from 'components/create/topics';
import Name from 'components/create/name';
import Creating from 'components/create/creating';
import Share from 'components/create/share';
import Rounds from 'components/create/rounds';

function CreateContainer({ children }) {
  const createContainerClasses = cx(
    'container flex-grow--1 flex direction--column align-items--center margin--large padding-t--large padding-h--base padding-b--s',
    'md:flex-grow--0 md:width--70-pct md:max-width--36',
    'lg:flex-grow--0 lg:width--40-pct lg:max-width--36'
  );

  return <div class={createContainerClasses}>{children}</div>;
}

const Create = ({ gameId, createGame, topicPacks }) => {
  const [gameMode, setGameMode] = useState(INDIVIDUALS);
  const [numRounds, setNumRounds] = useState(1);
  const [topicPackUid, setTopicPackUid] = useState(WRITE_OUR_OWN_UID);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(gameId ? 3 : 0);
  const [focused, setFocused] = useState(false);

  const handleStartGame = () => {
    setLoading(true);

    createGame({ name, gameMode, topicPackUid, numRounds }).catch(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (gameId) {
      setStep(3);
    }
  }, [gameId]);

  return (
    <div class="create flex direction--column height--100-pct bg-color--primary">
      <div class="margin-t--xlarge md:flex-grow--1 lg:flex-grow--1">
        <Logo size={isDesktop() ? 'med' : 'small'} />
      </div>
      <SwipeableViews
        containerStyle={{ flexGrow: 1 }}
        disabled={!!gameId || loading}
        index={step}
        onChangeIndex={setStep}
        slideClassName="flex direction--column md:align-items--center lg:align-items--center"
        className="flex direction--column flex-grow--1 md:flex-grow--0 lg:flex-grow--0"
      >
        {false && (
          <CreateContainer>
            <GameMode gameMode={gameMode} setGameMode={setGameMode} />
          </CreateContainer>
        )}
        <CreateContainer>
          <Rounds numRounds={numRounds} setNumRounds={setNumRounds} />
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
        {gameId && (
          <CreateContainer>
            <Share gameId={gameId} />
          </CreateContainer>
        )}
      </SwipeableViews>
      {!focused && (
        <div class="flex justify--between margin-h--large margin-b--large md:align-self--center md:width--70-pct md:max-width--36 lg:align-self--center lg:width--40-pct lg:max-width--36">
          <div
            class={cx({
              'visibility--hidden': loading || gameId || step === 0
            })}
          >
            <Button
              name="back"
              onClick={() => setStep(prevStep => prevStep - 1)}
              variant="text-invert"
            >
              <div class="flex align-items--center">
                <IconArrowLeft white />
                Back
              </div>
            </Button>
          </div>
          <div
            class={cx({
              'visibility--hidden': loading || gameId || step === 2
            })}
          >
            <Button
              name="next"
              onClick={() => setStep(prevStep => prevStep + 1)}
              variant="text-invert"
            >
              <div class="flex align-items--center">
                Next
                <IconArrowRight white />
              </div>
            </Button>
          </div>
        </div>
      )}
      <div class="md:flex-grow--1 lg:flex-grow--1" />
    </div>
  );
};

// state
const withTopicPacksState = withState('topicPacks');
const withGameIdState = withState('gameId');

// actions
const withStartGameAction = withAction(createGame, 'createGame');
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
  withGameIdState,
  withEffect
);

export { Create };
export default wrappers(Create);
