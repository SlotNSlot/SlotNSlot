import { fromJS } from 'immutable';
import { ACTION_TYPES } from './actions';

const AVAILABLE_HIT_RATIO = [10, 12.5, 15];

export const MAKE_GAME_INITIAL_STATE = fromJS({
  hitRatio: null,
  totalStake: 0,
  maxPrize: 0,
  betMinValue: 0,
  betMaxValue: 0,
  slotName: '',
  isLoading: false,
  hasFailed: false,
});

export function reducer(state = MAKE_GAME_INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPES.START_TO_MAKE_GAME: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', true).set('hasFailed', false);
      });
    }

    case ACTION_TYPES.SUCCEED_TO_MAKE_GAME: {
      return MAKE_GAME_INITIAL_STATE;
    }

    case ACTION_TYPES.FAILED_TO_MAKE_GAME: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', false).set('hasFailed', true);
      });
    }

    case ACTION_TYPES.SELECT_HIT_RATIO: {
      if (!AVAILABLE_HIT_RATIO.includes(action.payload.hitRatio)) {
        return state;
      }
      return state.set('hitRatio', action.payload.hitRatio);
    }

    case ACTION_TYPES.CHANGE_TOTAL_STAKE: {
      return state.set('totalStake', action.payload.totalStake);
    }

    case ACTION_TYPES.SET_MAX_PRIZE: {
      return state.set('maxPrize', action.payload.maxPrize);
    }

    case ACTION_TYPES.SET_BET_MIN_VALUE: {
      return state.set('betMinValue', action.payload.value);
    }

    case ACTION_TYPES.SET_BET_MAX_VALUE: {
      return state.set('betMaxValue', action.payload.value);
    }

    case ACTION_TYPES.SET_SLOT_NAME: {
      return state.set('slotName', action.payload.slotName);
    }

    default:
      return state;
  }
}
