import { h } from 'preact';

import Coachmark from 'components/shared/coachmark';

function AddTopicsCoachmark() {
  return (
    <Coachmark eventLabel="add_topics" white>
      Topics are people, places and things that you’ll be asked to rank
      throughout the game. Good topics are things that are trivial yet
      polarizing. Here are a few examples of potential topics:
      <ul>
        <li>Las Vegas</li>
        <li>Dave Matthews Band</li>
        <li>The Bachelor</li>
        <li>Going to the movies alone</li>
      </ul>
      Here are some things to avoid:
      <ul>
        <li>
          "Either/ors" like "cats or dogs". That’s an entirely different game.
          Just enter "cats!" Better yet, enter "Cats! The Musical"
        </li>
        <li>
          Broad categories like "airlines" or "music". It’s fun to get specific.
          Instead, try "Delta Airlines" or "Jazz"
        </li>
      </ul>
    </Coachmark>
  );
}

export default AddTopicsCoachmark;
