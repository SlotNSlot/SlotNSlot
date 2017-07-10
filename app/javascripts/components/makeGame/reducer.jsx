import { fromJS } from 'immutable';
import { ACTION_TYPES } from './actions';

export const MAKE_GAME_INITIAL_STATE = fromJS({
  currentStep: 2,
  hitRatio: null,
  totalStake: null,
  maxPrize: null,
  betMinValue: null,
  betMaxValue: null,
  isLoading: false,
});

export function reducer(state = MAKE_GAME_INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPES.START_TO_POST_FORM: {
      return state.set('isLoading', true);
    }

    default:
      return state;
  }
}
