import { h } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import sampleSize from 'lodash/sampleSize';

import cx from 'utilities/cx';
import compose from 'utilities/compose';
import {
  topicsToPlayerTopics,
  toAvailableAndRankingTopicsCount,
  toAllActivePlayers
} from 'utilities/state_mapping';
import { withAction, withState } from '@state';
import { addTopic, getTopicPacks } from '@actions';
import withRouter, { toGame } from 'utilities/router';

import Button from 'components/shared/button';
import Logo from 'components/shared/logo';
import TextInput from 'components/shared/text_input';

import AddTopicsCoachmark from './coachmark';
import Topic from 'components/add_topics/topic';

const AddTopics = ({
  addTopic,
  playerTopics,
  routes: [toGame],
  gameId,
  topicExample,
  onTopicAdded,
  remainingTopics,
  numPlayers
}) => {
  const [topic, setTopic] = useState('');
  const topicInputRef = useRef();

  const handleAddTopic = () => {
    addTopic(topic);
    setTopic('');

    if (topicInputRef.current) {
      topicInputRef.current.focus();
    }

    onTopicAdded && onTopicAdded();
  };

  return (
    <div class="add-topics flex direction--column height--100-pct bg-color--primary">
      <div class="flex-shrink--0 flex align-items--center margin-t--xlarge padding-h--base">
        <span class="color--white font-weight--bold">{gameId}</span>
        <span class="flex-grow--1">
          <Logo size="small" />
        </span>
        <AddTopicsCoachmark />
      </div>
      <div class="container flex direction--column align-items--center flex-grow--1 margin--large padding-v--large padding-b--s overflow--hidden">
        <h1 class="modal-header color--primary margin-b--large">
          {remainingTopics > 1 && `${remainingTopics} More Topics Needed`}
          {remainingTopics === 1 && '1 More Topic Needed'}
          {remainingTopics <= 0 && 'Enough Topics Added'}
        </h1>
        <form
          autoComplete="off"
          class="flex-shrink--0 flex padding-h--base"
          onSubmit={handleAddTopic}
        >
          <div class="margin-r--s">
            <TextInput
              getRef={topicInputRef}
              label="Polarizing Topic"
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
        <div class="flex-grow--1 min-height--huge flex direction--column margin-t--xlarge padding-h--base overflow-y--auto width--100-pct">
          {[...playerTopics].reverse().map((topic, index, arr) => (
            <div>
              <div class="margin-b--base">
                <Topic topic={topic} />
              </div>
              {index < arr.length - 1 && <hr class="margin-t--none" />}
            </div>
          ))}
        </div>
        <hr class="margin-t--none width--100-pct" />
        <div class="flex-shrink--0 flex direction--column align-items--center">
          <span class="font-weight--bold margin-b--base">
            1 round | {`${numPlayers} players`}
          </span>
          <Button
            disabled={remainingTopics > 0}
            name="done"
            onClick={toGame}
            variant="primary"
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
};

// actions
const withAddTopicAction = withAction(addTopic, 'addTopic');
const withGetTopicPacksAction = withAction(getTopicPacks, 'getTopicPacks');

// state
const withTopicsState = withState(
  'game.topics',
  'numTopics',
  toAvailableAndRankingTopicsCount
);
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

// routes
const withRoutes = withRouter(toGame);

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
      setRandomTopic(randomTopicFromTopicPacks(topicPacks));
    }, [topicPacks]);

    const onTopicAdded = useCallback(() => {
      setRandomTopic(randomTopicFromTopicPacks(topicPacks));
    }, [setRandomTopic, topicPacks]);

    return (
      <WrappedComponent
        {...props}
        onTopicAdded={onTopicAdded}
        topicExample={randomTopic}
      />
    );
  };
};

const withProps = WrappedComponent => {
  return props => {
    const { players, numTopics = 0 } = props;

    const remainingTopics = Math.max(players.length * 4 - numTopics);

    return (
      <WrappedComponent
        {...props}
        numPlayers={players.length}
        remainingTopics={remainingTopics}
      />
    );
  };
};

const wrappers = compose(
  withAddTopicAction,
  withGetTopicPacksAction,
  withTopicsState,
  withPlayerTopicsState,
  withPlayersState,
  withGameIdState,
  withTopicPacksState,
  withRoutes,
  withTopicExampleProp,
  withProps
);

export { AddTopics };
export default wrappers(AddTopics);
