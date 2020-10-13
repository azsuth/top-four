import { h } from 'preact';

import cx from 'utilities/cx';

import Footer from 'components/game/footer';
import Header from 'components/game/header';
import RankableTopics from 'components/game/rankable_topics';

function GameTopics({ gameState, showInfo }) {
  const gameTopicsClasses = cx(
    'game-topics container container--top-rounded flex direction--column align-items--center padding-v--large padding-h--s',
    { 'game-topics--hidden': showInfo }
  );

  return (
    <div class={gameTopicsClasses}>
      <Header gameState={gameState} />
      <RankableTopics gameState={gameState} />
      <Footer gameState={gameState} />
    </div>
  );
}

export default GameTopics;
