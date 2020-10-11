import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import cx from 'utilities/cx';
import compose from 'utilities/compose';
import { GAME_STATE } from 'utilities/constants';
import { withAction } from '@state';
import { revealTopic } from '@actions';

import Button from 'components/shared/button';
import IconSmallCheck from 'components/shared/icon/icon_small_check';
import IconSmallX from 'components/shared/icon/icon_small_x';

function revealable(state, topicStatus, ranker) {
  return state === GAME_STATE.LOCKED_IN && ranker && topicStatus !== 'ranked';
}

function renderRankerTopicStatus(showPercent, correctPercent) {
  if (showPercent) {
    return (
      <div class="flex direction--column justify--between align-items--center width--10-pct">
        <span class="color--primary font-weight--bold">{correctPercent}</span>
      </div>
    );
  }
}

function renderGuesserTopicStatus(
  state,
  correctPercent,
  isCorrect,
  showPercent
) {
  if (showPercent) {
    return (
      <div class="flex direction--column justify--between align-items--center width--10-pct">
        {isCorrect && <IconSmallCheck />}
        {!isCorrect && <IconSmallX />}
        <span class="font-weight--bold margin-t--xs">{correctPercent}</span>
      </div>
    );
  }

  if (state !== GAME_STATE.RANKING) {
    return (
      <div class="flex direction--column justify--between align-items--center width--10-pct">
        ...
      </div>
    );
  }
}

const RankableTopic = ({
  correctPercent,
  correctTopic,
  dragging,
  isCorrect,
  isRanked,
  gameState: { state, ranker, unlockedInPlayers },
  topic: { uid, topic, status: topicStatus },
  revealTopic
}) => {
  const [showPercent, setShowPercent] = useState(false);
  useEffect(() => {
    if (!showPercent && state !== GAME_STATE.RANKING && isRanked) {
      if (ranker) {
        setTimeout(() => setShowPercent(true), 250);
      } else {
        setShowPercent(true);
      }
    }
  }, [state, isRanked]);

  const handleReveal = () => {
    revealTopic(uid);
  };

  const isRevealable = revealable(state, topicStatus, ranker);

  const containerClasses = cx('rankable-topic position--relative rounded', {
    'rankable-topic--dragging': dragging,
    'opacity--50-pct': isRevealable && unlockedInPlayers.length > 0
  });

  const topicClasses = cx(
    'rankable-topic__topic flex justify--between align-items--center border b-color--primary rounded bg-color--white padding-h--base padding-v--large',
    {
      'rankable-topic__topic--dragging': dragging,
      'rankable-topic__topic--revealable': isRevealable
    }
  );

  return (
    <div class={containerClasses}>
      <div class="rankable-topic__reveal-container bg-color--primary rounded flex justify--end align-items--center padding-r--base">
        <Button
          disabled={unlockedInPlayers.length > 0}
          name="reveal"
          onClick={handleReveal}
          variant="text-invert"
        >
          Reveal
        </Button>
      </div>
      <div class={topicClasses}>
        <span class="font-weight--bold">{topic}</span>
        {ranker && renderRankerTopicStatus(showPercent, correctPercent)}
        {!ranker &&
          renderGuesserTopicStatus(
            state,
            correctPercent,
            isCorrect,
            showPercent
          )}
      </div>
    </div>
  );
};

const withProps = WrappedComponent => {
  return props => {
    const { activeTopics, guessesByTopic, localRanks, topic } = props;

    const localRank = localRanks[topic.uid];
    const correctTopic = activeTopics.find(
      ({ rank, status }) => rank === localRank && status === 'ranked'
    );
    const isRanked = !!correctTopic;
    const isCorrect = isRanked && topic.uid === correctTopic.uid;

    const totalGuesses = (isRanked && guessesByTopic[correctTopic.uid]) || [];
    const correctGuesses =
      isRanked && totalGuesses.filter(guess => guess === correctTopic.rank);

    const correctPercent = totalGuesses.length
      ? isRanked &&
        `${Math.round((correctGuesses.length / totalGuesses.length) * 100)}%`
      : '100%';

    return (
      <WrappedComponent
        {...props}
        correctPercent={correctPercent}
        correctTopic={correctTopic}
        isCorrect={isCorrect}
        isRanked={isRanked}
      />
    );
  };
};

// actions
const withRevealTopicAction = withAction(revealTopic, 'revealTopic');

const wrappers = compose(withProps, withRevealTopicAction);

export { RankableTopic };
export default wrappers(RankableTopic);
