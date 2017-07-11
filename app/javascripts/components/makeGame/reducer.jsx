import { fromJS } from 'immutable';
import { ACTION_TYPES } from './actions';

const AVAILABLE_HIT_RATIO = [10, 12.5, 15];

export const MAKE_GAME_INITIAL_STATE = fromJS({
  hitRatio: null,
  totalStake: null,
  maxPrize: null,
  betMinValue: null,
  betMaxValue: null,
  isLoading: false,
});

export function reducer(state = MAKE_GAME_INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPES.SELECT_HIT_RATIO: {
      if (!AVAILABLE_HIT_RATIO.includes(action.payload.hitRatio)) {
        return;
      }
      return state.set('hitRatio', action.payload.hitRatio);
    }

    default:
      return state;
  }
}
