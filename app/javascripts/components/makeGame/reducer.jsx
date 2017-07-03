import { fromJS } from 'immutable';
import { ACTION_TYPES } from './actions';
import { INPUT_TYPES } from './';

export const MAKE_GAME_INITIAL_STATE = fromJS({
  slotName: '',
  slotNameError: '',
  playerChance: 0,
  playerChanceError: '',
  minimumValue: 0,
  minimumValueError: '',
  maximumValue: 0,
  maximumValueError: '',
  deposit: 0,
  depositError: '',
  isLoading: false,
});

export function reducer(state = MAKE_GAME_INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPES.HANDLE_INPUT_CHANGE: {
      const { type, value } = action.payload;
      if (type === INPUT_TYPES.SLOT_NAME) {
        return state.set('slotName', value);
      } else if (type === INPUT_TYPES.PLAYER_CHANCE) {
        return state.set('playerChance', parseFloat(value));
      } else if (type === INPUT_TYPES.MINIMUM_VALUE) {
        return state.set('minimumValue', parseFloat(value));
      } else if (type === INPUT_TYPES.MAXIMUM_VALUE) {
        return state.set('maximumValue', parseFloat(value));
      } else if (type === INPUT_TYPES.DEPOSIT) {
        return state.set('deposit', parseFloat(value));
      }
      return state;
    }

    case ACTION_TYPES.ERROR_OCCURRED: {
      return state.withMutations(currentState => {
        for (const key in action.payload) {
          currentState.set(key, action.payload[key]);
        }
      });
    }

    case ACTION_TYPES.START_TO_POST_FORM: {
      return state.set('isLoading', true);
    }

    case ACTION_TYPES.SUCCEEDED_TO_POST_FORM: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', false);
      });
    }

    default:
      return state;
  }
}
