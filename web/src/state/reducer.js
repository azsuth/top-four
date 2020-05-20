import {
  TOPIC_PACKS,
  STARTED_GAME,
  GAME_UPDATE,
  UPDATE_LOCAL_RANKS,
  CLEAR_STATE,
  SHOW_COACHMARK,
  HIDE_COACHMARK
} from '@actions/types';

import { withReducerLogging } from 'utilities/logging';
import { withSaveableState } from 'utilities/local_storage';

const gameStateReducer = (state, { type, payload }) => {
  switch (type) {
    case STARTED_GAME:
      const { gameId, gameUid, playerUid, name } = payload;

      return { ...state, gameId, gameUid, playerUid, name };
    case GAME_UPDATE:
      const { game, localRanks } = payload;

      return { ...state, localRanks: localRanks || state.localRanks, game };
    case UPDATE_LOCAL_RANKS:
      return { ...state, localRanks: payload };
    case TOPIC_PACKS:
      return { ...state, topicPacks: payload };
    case CLEAR_STATE:
      return {};
    case SHOW_COACHMARK:
      return {
        ...state,
        coachmark: {
          show: true,
          content: payload
        }
      };
    case HIDE_COACHMARK:
      return {
        ...state,
        coachmark: {
          show: payload,
          content: null
        }
      };
    default:
      return state;
  }
};

export default withSaveableState(withReducerLogging(gameStateReducer));
