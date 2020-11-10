import { h } from 'preact';
import { shallow } from 'enzyme';

import { GAME_STATE } from 'utilities/constants';

import ConfirmButton from 'components/game/confirm_button';

import { footerContentForState } from 'components/game/game_state_helpers';

describe('game state helpers', () => {
  describe('footerContentForState', () => {
    it('returns a start round button between rounds for the next ranker', () => {
      const startRound = jest.fn();

      const wrapper = shallow(
        <div>
          {footerContentForState({
            gameState: {
              state: GAME_STATE.BETWEEN_ROUNDS,
              nextRanker: { isThisPlayer: true }
            },
            startRound
          })}
        </div>
      );

      expect(wrapper.containsMatchingElement(<ConfirmButton />)).toBe(true);
      expect(wrapper.find(ConfirmButton).props().confirmAction).toEqual(
        startRound
      );
    });

    it('returns a waiting message between rounds for the next guesser', () => {
      const wrapper = shallow(
        <div>
          {footerContentForState({
            gameState: {
              state: GAME_STATE.BETWEEN_ROUNDS,
              nextRanker: { isThisPlayer: false, name: 'Andrew' }
            }
          })}
        </div>
      );

      expect(wrapper.find(ConfirmButton).props().helperText).toBe(
        'Tell Andrew to start ranking!'
      );
    });

    it('returns a lock in button while ranking', () => {
      const lockIn = jest.fn();

      const wrapper = shallow(
        <div>
          {footerContentForState({
            gameState: { state: GAME_STATE.RANKING },
            lockIn
          })}
        </div>
      );

      expect(wrapper.containsMatchingElement(<ConfirmButton />)).toBe(true);
      expect(wrapper.find(ConfirmButton).props().confirmAction).toEqual(lockIn);
    });

    it('returns a message when everyone is locked in', () => {
      const wrapper = shallow(
        <div>
          {footerContentForState({
            gameState: {
              state: GAME_STATE.LOCKED_IN,
              unlockedInPlayers: []
            }
          })}
        </div>
      );

      expect(wrapper.find(ConfirmButton).props().helperText).toBe(
        `Everyone's locked in!`
      );
    });

    it('returns a message when only one player is not locked in', () => {
      const wrapper = shallow(
        <div>
          {footerContentForState({
            gameState: {
              state: GAME_STATE.LOCKED_IN,
              unlockedInPlayers: [{ name: 'Emily' }]
            }
          })}
        </div>
      );

      expect(wrapper.find(ConfirmButton).props().helperText).toBe(
        'Waiting on Emily to lock in!'
      );
    });

    it('returns a message when more than one player is not locked in', () => {
      const wrapper = shallow(
        <div>
          {footerContentForState({
            gameState: {
              state: GAME_STATE.LOCKED_IN,
              unlockedInPlayers: [{ name: 'Emily' }, { name: 'Harrison' }]
            }
          })}
        </div>
      );

      expect(wrapper.find(ConfirmButton).props().helperText).toBe(
        'Waiting on 2 players to lock in!'
      );
    });

    it('returns a message when the game is over and this is not the active player', () => {
      const wrapper = shallow(
        <div>
          {footerContentForState({
            gameState: {
              state: GAME_STATE.END_GAME,
              nextRanker: { isThisPlayer: false, name: 'Emily' }
            }
          })}
        </div>
      );

      expect(wrapper.find(ConfirmButton).props().helperText).toBe(
        'Waiting on Emily to reveal the winner!'
      );
    });

    it('returns an end game button for the active player', () => {
      const wrapper = shallow(
        <div>
          {footerContentForState({
            gameState: {
              state: GAME_STATE.END_GAME,
              nextRanker: { isThisPlayer: true, name: 'Emily' }
            }
          })}
        </div>
      );

      expect(wrapper.find(ConfirmButton).props().confirmText).toBe(
        'Reveal the winner?'
      );
    });
  });
});
