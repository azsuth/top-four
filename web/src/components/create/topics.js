import { h } from 'preact';

import Coachmark from 'components/shared/coachmark';
import RadioInput from 'components/shared/radio_input';

const Topics = ({ topicPacks, topicPackUid, setTopicPackUid }) => {
  return (
    <div class="topics flex-grow--1 width--100-pct flex direction--column align-items--center">
      <h1 class="modal-header color--primary-dark margin-b--large">
        What topics do you want to play with?
      </h1>
      <div class="flex-grow--1">
        {topicPacks &&
          topicPacks.map(({ uid, name }) => (
            <div key={uid} class="margin-b--large">
              <RadioInput
                checked={topicPackUid === uid}
                label={name}
                name={uid}
                onChange={() => setTopicPackUid(uid)}
                value={uid}
              />
            </div>
          ))}
      </div>
      <div class="align-self--end">
        <Coachmark eventLabel="topic_packs">
          Topics are people, places and things that you’ll be asked to rank each
          round.
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
  );
};

export default Topics;
