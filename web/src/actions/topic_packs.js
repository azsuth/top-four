import { TOPIC_PACKS } from '@actions/types';
import { getTopicPacksService } from '@services';
import { tagLogger } from 'utilities/logging';
import { WRITE_OUR_OWN_UID } from 'utilities/constants';

const getTopicPacks = async ({ state, dispatch }) => {
  if (state.topicPacks && state.topicPacks.length > 0) return;

  const topicPacks = await getTopicPacksService().catch(
    tagLogger('getTopicPacksService failed')
  );

  if (topicPacks) {
    const packs = Object.keys(topicPacks)
      .map(uid => ({ uid, ...topicPacks[uid] }))
      .sort(({ isRandomPack }) => (isRandomPack ? -1 : 1));

    packs.unshift({
      uid: WRITE_OUR_OWN_UID,
      isRandomPack: false,
      name: 'Write our own!'
    });

    dispatch({ type: TOPIC_PACKS, payload: packs });
  }
};

export { getTopicPacks };
