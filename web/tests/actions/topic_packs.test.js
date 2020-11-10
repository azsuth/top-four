import { getTopicPacksService } from '@services';

jest.mock('@services', () => ({
  getTopicPacksService: jest.fn()
}));

import { getTopicPacks } from '@actions/topic_packs';

import { TOPIC_PACKS } from '@actions/types';
import { WRITE_OUR_OWN_UID } from 'utilities/constants';

describe('topic pack actions', () => {
  beforeEach(() => {
    getTopicPacksService.mockRestore();
  });

  describe('getTopicPacks', () => {
    it('calls getTopicPacksService', () => {
      getTopicPacksService.mockResolvedValue({});

      getTopicPacks({ state: {}, dispatch: () => {} });

      expect(getTopicPacksService).toHaveBeenCalledTimes(1);
    });

    it('dispatches the topic packs action on success', async () => {
      getTopicPacksService.mockResolvedValue({
        12345: {
          name: 'pack 1',
          topics: { 1: {}, 2: {}, 3: {}, 4: {} }
        },
        23456: {
          name: 'random pack',
          topics: {
            a: {},
            b: {},
            c: {},
            d: {},
            e: {},
            f: {},
            g: {},
            h: {},
            i: {}
          },
          isRandomPack: true
        }
      });
      const dispatch = jest.fn();

      await getTopicPacks({ state: {}, dispatch });

      expect(dispatch).toHaveBeenCalledTimes(1);

      const dispatchedAction = dispatch.mock.calls[0][0];

      expect(dispatchedAction.type).toBe(TOPIC_PACKS);
      expect(dispatchedAction.payload.length).toBe(3);
      expect(dispatchedAction.payload[0].uid).toBe(WRITE_OUR_OWN_UID);
      expect(dispatchedAction.payload[1].uid).toBe('23456');
      expect(dispatchedAction.payload[2].uid).toBe('12345');
      expect(dispatchedAction.payload[2].name).toBe('pack 1');
    });

    it('does not call getTopicPacksService if topic packs already exist', () => {
      getTopicPacksService.mockResolvedValue({});

      getTopicPacks({ state: { topicPacks: [42] } });

      expect(getTopicPacksService).not.toHaveBeenCalled();
    });
  });
});
