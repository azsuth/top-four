import { h, Fragment } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import sampleSize from 'lodash/sampleSize';

import compose from 'utilities/compose';
import { isDesktop } from 'utilities/device';
import withRouter, { toPlayers } from 'utilities/router';
import {
  topicsToPlayerTopics,
  toAllActivePlayers
} from 'utilities/state_mapping';

import { withAction, withState } from '@state';
import { addTopic, getTopicPacks } from '@actions';

import Button from 'components/shared/button';
import Logo from 'components/shared/logo';
import TextInput from 'components/shared/text_input';

import AddTopicsCoachmark from './coachmark';
import Topic from 'components/add_topics/topic';
import { logErrorMessage } from '@services/logger';

const AddTopics = ({
  addTopic,
  gameId,
  numPlayers,
  numRounds,
  playerTopics = [],
  remainingPlayerTopics,
  routes: [toPlayers],
  topicExample
}) => {
  const [error, setError] = useState(null);
  const [topic, setTopic] = useState('');
  const [errorWidth, setErrorWidth] = useState(null);
  const topicInputRef = useRef();

  const handleAddTopic = () => {
    addTopic(topic).catch(playerName => {
      setError(`Ope! ${playerName} already added that...try again`);
    });
    setTopic('');

    if (topicInputRef.current) {
      topicInputRef.current.focus();
    }
  };

  useEffect(() => {
    if (topicInputRef.current) {
      setErrorWidth(topicInputRef.current.offsetWidth);
    }
  }, [topicInputRef.current]);

  useEffect(() => {
    if (topic) {
      setError(null);
    }
  }, [topic]);

  return (
    <div class="add-topics flex direction--column align-items--center padding-h--large padding-b--large lg:padding-b--10-vh height--100-pct bg-color--primary">
      <div class="flex-shrink--0 flex justify--center align-items--center margin-t--xlarge lg:margin-t--none lg:height--10-vh padding-h--large width--100-pct lg:max-width--45-pct">
        <span class="color--white font-weight--bold">{gameId}</span>
        <span class="flex-grow--1 md:flex-grow--0 lg:flex-grow--0 md:margin-h--xlarge lg:margin-h--xlarge">
          <Logo size={isDesktop() ? 'med' : 'small'} />
        </span>
        <AddTopicsCoachmark />
      </div>
      <div class="container flex direction--column align-items--center flex-grow--1 margin-t--large lg:margin-t--none padding-v--large padding-b--s overflow--hidden width--100-pct lg:max-width--45-pct">
        <h1 class="modal-header color--primary-darkest margin-b--base">
          {remainingPlayerTopics > 1 &&
            `Enter ${remainingPlayerTopics} More Topics`}
          {remainingPlayerTopics === 1 && 'Enter 1 More Topic'}
          {remainingPlayerTopics <= 0 && 'Enough Topics Added'}
        </h1>
        <form
          autoComplete="off"
          class="flex-shrink--0 flex justify--center padding-h--base width--100-pct"
          onSubmit={handleAddTopic}
        >
          <div class="flex direction--column margin-r--s md:width--60-pct lg:width--60-pct">
            <TextInput
              disabled={remainingPlayerTopics === 0}
              getRef={topicInputRef}
              label="Polarizing Thing"
              name="topic"
              onChange={setTopic}
              placeholder={topicExample ? `e.g. ${topicExample}` : null}
              value={topic}
            />
          </div>
          <Button
            disabled={!topic}
            name="add"
            onClick={handleAddTopic}
            variant="primary"
          >
            Add
          </Button>
        </form>
        {error && (
          <span
            class="align-self--start color--primary font-size--s font-weight--bold margin-l--large margin-t--xxs"
            style={{ width: errorWidth }}
          >
            {error}
          </span>
        )}
        <div class="flex-grow--1 min-height--huge flex direction--column margin-t--xlarge padding-l--add_topic md:padding-l--none lg:padding-l--none padding-r--base md:padding-r--none lg:padding-r--none overflow-y--auto width--100-pct md:width--66-pct lg:width--66-pct">
          {[...playerTopics].reverse().map((topic, index, arr) => (
            <>
              <div class="margin-b--base">
                <Topic topic={topic} />
              </div>
              {index < arr.length - 1 && <hr class="margin-t--none" />}
            </>
          ))}
        </div>
        <hr class="margin-t--none width--100-pct" />
        <div class="flex-shrink--0 flex direction--column align-items--center">
          <span class="font-weight--bold margin-b--base">
            {numRounds} round{numRounds > 1 && 's'} | {`${numPlayers} players`}
          </span>
          {remainingPlayerTopics > 0 && (
            <span class="color--light-gray margin-t--s">
              Keep adding topics!
            </span>
          )}
          {remainingPlayerTopics === 0 && (
            <Button name="done" onClick={toPlayers}>
              Done Adding Topics
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const withRoutes = withRouter(toPlayers);

// actions
const withAddTopicAction = withAction(addTopic, 'addTopic');
const withGetTopicPacksAction = withAction(getTopicPacks, 'getTopicPacks');

// state
const withPlayerTopicsState = withState(
  null,
  'playerTopics',
  topicsToPlayerTopics
);
const withPlayersState = withState(
  'game.players',
  'players',
  toAllActivePlayers
);
const withGameIdState = withState('gameId');
const withTopicPacksState = withState('topicPacks');
const withNumRoundsState = withState('game.numRounds', 'numRounds');

const randomTopicFromTopicPacks = topicPacks => {
  if (topicPacks) {
    const randomTopicsPack = topicPacks.find(
      ({ isRandomPack }) => isRandomPack
    );

    if (randomTopicsPack) {
      const randomTopics = Object.keys(randomTopicsPack.topics)
        .map(topicUid => randomTopicsPack.topics[topicUid].topic)
        .filter(topic => topic.length < 18);

      return sampleSize(randomTopics, 1);
    }
  }
};

const withTopicExampleProp = WrappedComponent => {
  return props => {
    const { topicPacks, getTopicPacks } = props;
    const [randomTopic, setRandomTopic] = useState(
      randomTopicFromTopicPacks(topicPacks)
    );

    useEffect(() => {
      getTopicPacks();
    }, []);

    useEffect(() => {
      if (topicPacks) {
        if (!randomTopic) {
          setRandomTopic(randomTopicFromTopicPacks(topicPacks));
        } else {
          setTimeout(() => {
            setRandomTopic(randomTopicFromTopicPacks(topicPacks));
          }, 5000);
        }
      }
    }, [topicPacks, randomTopic]);

    return <WrappedComponent {...props} topicExample={randomTopic} />;
  };
};

const withProps = WrappedComponent => {
  return props => {
    const { numRounds, players, playerTopics } = props;

    const remainingPlayerTopics = 4 * numRounds - (playerTopics || []).length;

    return (
      <WrappedComponent
        {...props}
        numPlayers={(players || []).length}
        remainingPlayerTopics={remainingPlayerTopics}
      />
    );
  };
};

const wrappers = compose(
  withRoutes,
  withAddTopicAction,
  withGetTopicPacksAction,
  withPlayerTopicsState,
  withPlayersState,
  withGameIdState,
  withTopicPacksState,
  withNumRoundsState,
  withTopicExampleProp,
  withProps
);

export { AddTopics };
export default wrappers(AddTopics);
