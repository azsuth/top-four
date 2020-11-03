import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import sampleSize from 'lodash/sampleSize';

import compose from 'utilities/compose';
import {
  topicsToPlayerTopics,
  toAvailableAndRankingTopicsCount,
  toAllActivePlayers,
  toActivePlayerTurns,
  toPlayersWithTopicsCount
} from 'utilities/state_mapping';
import { withAction, withState } from '@state';
import { addTopic, getTopicPacks, startGame } from '@actions';

import Button from 'components/shared/button';
import Logo from 'components/shared/logo';
import TextInput from 'components/shared/text_input';

import AddTopicsCoachmark from './coachmark';
import Topic from 'components/add_topics/topic';

const AddTopics = ({
  addTopic,
  gameId,
  isLeadPlayer,
  leadPlayer,
  numPlayers,
  numRounds,
  playerTopics,
  remainingPlayers,
  remainingPlayerTopics,
  remainingTotalTopics,
  startGame,
  topicExample
}) => {
  const [topic, setTopic] = useState('');
  const topicInputRef = useRef();

  const handleAddTopic = () => {
    addTopic(topic);
    setTopic('');

    if (topicInputRef.current) {
      topicInputRef.current.focus();
    }
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
        <h1 class="modal-header color--primary-darkest margin-b--base">
          {remainingPlayerTopics > 1 &&
            `Enter ${remainingPlayerTopics} More Topics`}
          {remainingPlayerTopics === 1 && 'Enter 1 More Topic'}
          {remainingPlayerTopics <= 0 && 'Enough Topics Added'}
        </h1>
        <form
          autoComplete="off"
          class="flex-shrink--0 flex padding-h--base"
          onSubmit={handleAddTopic}
        >
          <div class="margin-r--s">
            <TextInput
              disabled={remainingPlayerTopics === 0}
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
            {numRounds} round{numRounds > 1 && 's'} | {`${numPlayers} players`}
          </span>
          {remainingPlayerTopics > 0 && (
            <span class="color--light-gray margin-t--s">
              Keep adding topics!
            </span>
          )}
          {remainingPlayerTopics === 0 && remainingPlayers.length > 1 && (
            <span class="color--light-gray margin-t--s">
              Waiting on {remainingPlayers.length} player
              {remainingPlayers > 1 ? 's' : ''} to enter topics.
            </span>
          )}
          {remainingPlayerTopics === 0 && remainingPlayers.length === 1 && (
            <span class="color--light-gray margin-t--s">
              Waiting on {remainingPlayers[0].name} to enter topics.
            </span>
          )}
          {remainingTotalTopics === 0 && isLeadPlayer && numPlayers === 1 && (
            <span class="color--light-gray margin-t--s">
              Waiting on more players.
            </span>
          )}
          {remainingTotalTopics === 0 && isLeadPlayer && numPlayers > 1 && (
            <Button name="done" onClick={() => startGame()} variant="primary">
              Start Game
            </Button>
          )}
          {remainingTotalTopics === 0 && !isLeadPlayer && (
            <span class="color--light-gray margin-t--s">
              Tell {leadPlayer.name} to start the game!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// actions
const withAddTopicAction = withAction(addTopic, 'addTopic');
const withGetTopicPacksAction = withAction(getTopicPacks, 'getTopicPacks');
const withStartGameAction = withAction(startGame, 'startGame');

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
const withNumRoundsState = withState('game.numRounds', 'numRounds');
const withPlayerTurnsState = withState(
  'game',
  'playerTurns',
  toActivePlayerTurns
);
const withPlayerUidState = withState('playerUid');
const withPlayersMissingTopicsState = withState(
  'game',
  'playersWithTopicsCount',
  toPlayersWithTopicsCount
);

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
    const {
      numRounds,
      numTopics = 0,
      players,
      playerTopics,
      playerTurns,
      playerUid,
      playersWithTopicsCount
    } = props;

    const roundsPlayed = playerTurns[players[players.length - 1].uid] || 0;
    const remainingRounds = numRounds - roundsPlayed;

    const remainingTotalTopics =
      players.length * 4 * remainingRounds - numTopics;
    const remainingPlayers = playersWithTopicsCount.filter(
      ({ numTopics }) => numTopics < remainingRounds * 4
    );
    const remainingPlayerTopics = 4 * remainingRounds - playerTopics.length;

    const leadPlayer = players[0];
    const isLeadPlayer = leadPlayer.uid === playerUid;

    return (
      <WrappedComponent
        {...props}
        leadPlayer={leadPlayer}
        isLeadPlayer={isLeadPlayer}
        numPlayers={players.length}
        remainingPlayers={remainingPlayers}
        remainingPlayerTopics={remainingPlayerTopics}
        remainingTotalTopics={remainingTotalTopics}
      />
    );
  };
};

const wrappers = compose(
  withAddTopicAction,
  withGetTopicPacksAction,
  withStartGameAction,
  withTopicsState,
  withPlayerTopicsState,
  withPlayersState,
  withGameIdState,
  withTopicPacksState,
  withNumRoundsState,
  withPlayerTurnsState,
  withPlayerUidState,
  withPlayersMissingTopicsState,
  withTopicExampleProp,
  withProps
);

export { AddTopics };
export default wrappers(AddTopics);
