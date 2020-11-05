import { h } from 'preact';

import Logo from 'components/shared/logo';

const Instructions = () => (
  <div>
    <Logo size="small" />
    <br />
    Top Four is the best party game you can play on your phone. Get to know your
    friends by debating hot takes!
    <br />
    <br />
    How to play:
    <br />
    1. The goal of the game is to guess how your friends feel about trivial, yet
    polarizing things.
    <br />
    2. When it's your turn, you'll be given four divisive people, places, or
    things to rank from best to worst.
    <br />
    3. Meanwhile, all other players will guess how you respond.
    <br />
    4. Players get (1) point for each ranking that they guess correctly and the
    player with the most points at the end wins!
    <br />
    <br />
    How to start:
    <br />
    1. Once you have a group of players together, click "Start a Game" and
    follow the prompts.
    <br />
    2. You'll receive a game code to share with the other players.
    <br />
    3. The rest of the players click "Join a Game" and enter the code.
    <br />
    4. Begin playing and let the fun begin!
  </div>
);

export { Instructions };
export default Instructions;
