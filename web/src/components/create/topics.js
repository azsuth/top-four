import { h } from 'preact';
import { FormControlLabel, RadioGroup, Radio } from '@material-ui/core';

import Coachmark from 'components/shared/coachmark';

const Topics = ({ topicPacks, topicPackUid, setTopicPackUid }) => {
  return (
    <div class="topics">
      <div class="topics__header">
        <span class="topics__header--title">
          What topics do you want to play with?
        </span>
        <div class="topics__header--coachmark">
          <Coachmark eventLabel="topic_packs">
            Topics are people, places and things that you’ll be asked to rank
            each round.
            <br />
            <br />
            If you’re new to Top Four, we recommend selecting "Random" to play
            with topics we’ve provided.
            <br />
            <br />
            If you’ve played before, it’s a ton of fun to write your own!
          </Coachmark>
        </div>
      </div>
      <div class="topics__choices">
        <RadioGroup
          value={topicPackUid}
          onChange={({ target: { value } }) => setTopicPackUid(value)}
        >
          {topicPacks &&
            topicPacks.map(({ uid, name }) => (
              <FormControlLabel value={uid} control={<Radio />} label={name} />
            ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default Topics;
