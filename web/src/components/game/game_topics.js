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
      <div class="flex-grow--1 width--100-pct">
        <RankableTopics gameState={gameState} />
      </div>
      <div class="width--100-pct">
        <Footer gameState={gameState} />
      </div>
    </div>
  );
}

export default GameTopics;
