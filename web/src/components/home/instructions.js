import { h } from 'preact';

import Logo from 'components/shared/logo';

const Instructions = () => (
  <div>
    <Logo size="small" />
    <br />
    Top Four is a party game in which you rank random things and your friends
    guess how you ranked them. Do you like mayonnaise more than small dogs? Are
    you secretly Kenny G's biggest fan? Is coffee not your cup of tea? Let's
    find out!
    <h2>Overview</h2>
    Throughout the game each player will take turns being the "Ranker." When
    you're the Ranker, you'll receive 4 trivial yet polarizing topics to rank
    from best to worst based on your personal preference.
    <br />
    <br />
    For example, you may see: Road Trips, Rainy Sundays, Dave Matthews Band, and
    Scrambled Eggs. Rank them based on how you feel about each one and "lock in"
    your response. Be sure to keep your response a secret from the other
    players!
    <br />
    All other players in the game will try to guess how you responded, then
    "lock in" on their own screens. Once everyone is locked in, you reveal your
    response.
    <br />
    <br />
    Once you have revealed the position of all 4 topics, another player will be
    prompted to take their turn as the Ranker. The game continues until there
    are no more topics left to rank.
    <h2>How to start</h2>
    Once you have a group of players together, click "Start a Game" and follow
    the prompts. You'll receive a game code to share with the other players. The
    rest of the players click "Join a Game" enter the code, and start playing.
    <h2>How to win</h2>
    Players get 1 point for each topic that they place in the exact same
    position as the Ranker. The player with the most points at the end of the
    game wins!
  </div>
);

export { Instructions };
export default Instructions;
