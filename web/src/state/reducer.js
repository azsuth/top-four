import {
  TOPIC_PACKS,
  STARTED_GAME,
  GAME_UPDATE,
  UPDATE_LOCAL_RANKS,
  CLEAR_STATE,
  SHOW_COACHMARK,
  HIDE_COACHMARK
} from '@actions/types';
import { WRITE_OUR_OWN_UID } from 'utilities/constants';
import { withReducerLogging } from 'utilities/logging';

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

export default withReducerLogging(gameStateReducer);
