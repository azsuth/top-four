import { h } from 'preact';

import cx from 'utilities/cx';

import Footer from 'components/game/footer';
import Header from 'components/game/header';
import RankableTopics from 'components/game/rankable_topics';

function GameTopics({ gameState, hideInfo, showInfo, topicsTop }) {
  const gameTopicsClasses = cx(
    'game-topics container container--top-rounded flex direction--column align-items--center padding-h--s',
    {
      'game-topics--hidden': showInfo,
      'padding-t--xs': showInfo,
      'padding-v--large': !showInfo
    }
  );

  return (
    <div
      class={gameTopicsClasses}
      style={{ top: showInfo ? undefined : topicsTop }}
    >
      {gameState && (
        <>
          <Header
            gameState={gameState}
            hideInfo={hideInfo}
            showInfo={showInfo}
          />
          <RankableTopics gameState={gameState} />
          <Footer gameState={gameState} />
        </>
      )}
    </div>
  );
}

export default GameTopics;
