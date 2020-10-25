import { subscribeToGameUpdatesService } from '@services';

jest.mock('@services', () => ({
  subscribeToGameUpdatesService: jest.fn()
}));

import { subscribeToGameUpdates } from '@actions/subscribe';

import { GAME_UPDATE } from '@actions/types';
import { GAME_STATE } from 'utilities/constants';

describe('subscription actions', () => {
  beforeEach(() => {
    subscribeToGameUpdatesService.mockRestore();
  });

  describe('subscribeToGameUpdates', () => {
    it('calls subscribeToGameUpdatesService with gameUid', () => {
      subscribeToGameUpdates('12345', null, { dispatch: jest.fn() });

      expect(subscribeToGameUpdatesService).toHaveBeenCalledTimes(1);
      expect(subscribeToGameUpdatesService.mock.calls[0][0]).toBe('12345');
    });

    it('dispatches the game update action on new data', () => {
      const dispatch = jest.fn();

      subscribeToGameUpdates('12345', null, { dispatch });

      const on = subscribeToGameUpdatesService.mock.calls[0][1];
      on({ newData: '98765' });

      expect(dispatch).toHaveBeenCalledTimes(1);

      const dispatchedAction = dispatch.mock.calls[0][0];

      expect(dispatchedAction.type).toBe(GAME_UPDATE);
      expect(dispatchedAction.payload).toEqual({
        game: { newData: '98765' },
        localRanks: null
      });
    });

    it('calculates default local ranks when round starts', () => {
      const dispatch = jest.fn();
      const topics = {
        12345: { status: 'active' },
        23456: { status: 'active' },
        34567: { status: 'active' },
        45678: { status: 'available' },
        56789: { status: 'active' }
      };

      subscribeToGameUpdates(
        '12345',
        { state: GAME_STATE.BETWEEN_ROUNDS },
        { dispatch }
      );

      const on = subscribeToGameUpdatesService.mock.calls[0][1];
      on({ state: 'ranking', topics });

      expect(dispatch.mock.calls[0][0].payload.localRanks).toEqual({
        12345: 0,
        23456: 1,
        34567: 2,
        56789: 3
      });
    });
  });
});
