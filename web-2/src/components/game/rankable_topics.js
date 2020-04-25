import { h } from 'preact';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import compose from 'utilities/compose';
import { toActiveTopics, toGuessesByTopic } from 'utilities/state_mapping';
import { withAction, withState } from '@state';
import { updateLocalRanks } from '@actions';
import { GAME_STATE } from 'utilities/constants';

import RankableTopic from 'components/game/rankable_topic';

const RankableTopics = ({ activeTopics, updateLocalRanks, gameState }) => {
  const handleDragEnd = drag => {
    const {
      source: { index: sourceIndex },
      destination: { index: destinationIndex }
    } = drag;
    updateLocalRanks(activeTopics, sourceIndex, destinationIndex);
  };

  return (
    <div class="rankable-topics">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {activeTopics.map((topic, index) => (
                <Draggable
                  key={topic.uid}
                  draggableId={topic.uid}
                  index={index}
                  isDragDisabled={gameState.state !== GAME_STATE.RANKING}
                >
                  {(provided, snapshot) => (
                    <div
                      class="rankable-topics__topic"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <RankableTopic
                        topic={topic}
                        gameState={gameState}
                        dragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

// state
const withActiveTopicsState = withState(
  'game.topics',
  'activeTopics',
  toActiveTopics
);
const withLocalRanksState = withState('localRanks');
const withGuessesByTopicState = withState(
  'game.guesses',
  'guessesByTopic',
  toGuessesByTopic
);

// actions
const withUpdateLocalRanksAction = withAction(
  updateLocalRanks,
  'updateLocalRanks'
);

const withProps = WrappedComponent => {
  return props => {
    const { activeTopics, localRanks, guessesByTopic } = props;

    const sortedByLocalRank = activeTopics
      .sort(({ uid: uidA }, { uid: uidB }) =>
        localRanks ? localRanks[uidA] - localRanks[uidB] : 1
      )
      .map((topic, index, topics) => {
        const correctTopic = topics.find(({ rank }) => rank === index);
        const topicGuesses = correctTopic && guessesByTopic[correctTopic.uid];

        return {
          ...topic,
          localRank: index,
          correctTopic,
          correctGuesses:
            topicGuesses &&
            topicGuesses.filter(guess => guess === correctTopic.rank).length,
          totalGuesses: correctTopic && guessesByTopic[correctTopic.uid].length
        };
      });

    return <WrappedComponent {...props} activeTopics={sortedByLocalRank} />;
  };
};

const wrappers = compose(
  withActiveTopicsState,
  withLocalRanksState,
  withGuessesByTopicState,
  withUpdateLocalRanksAction,
  withProps
);

export { withProps, RankableTopics };
export default wrappers(RankableTopics);
