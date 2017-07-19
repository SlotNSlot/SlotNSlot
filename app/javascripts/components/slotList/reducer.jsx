import { fromJS } from 'immutable';
import { ACTION_TYPES as MAKING_GAME_ACTION_TYPES } from '../makeGame/actions';
import { ACTION_TYPES } from './actions';

export const SORT_OPTIONS = {
  lastActive: 'Last Active',
  highStake: 'High Stake',
  lowBetSize: 'Low Bet Size',
  highBetSize: 'High Bet Size',
  highHitRatio: 'High Hit Ratio',
  popular: 'popular',
};

export const SLOT_LIST_INITIAL_STATE = fromJS({
  isLoading: false,
  hasError: false,
  sortOption: SORT_OPTIONS.lastActive,
  isSortDropdownOpen: false,
  allSlotContracts: [],
  mySlotContracts: [],
  page: 1,
  mySlotPage: 1,
  isMaking: false,
});

export function reducer(state = SLOT_LIST_INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPES.START_TO_GET_ALL_SLOT_MACHINES:
    case ACTION_TYPES.START_TO_GET_MY_SLOT_MACHINES: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', true).set('hasError', false);
      });
    }

    case ACTION_TYPES.SUCCEEDED_TO_GET_ALL_SLOT_MACHINES: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', false).set('allSlotContracts', action.payload.slotContracts);
      });
    }

    case ACTION_TYPES.SUCCEEDED_TO_GET_MY_SLOT_MACHINES: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', false).set('mySlotContracts', action.payload.slotContracts);
      });
    }

    case MAKING_GAME_ACTION_TYPES.START_TO_MAKE_GAME: {
      return state.set('isMaking', true);
    }

    case MAKING_GAME_ACTION_TYPES.FAILED_TO_MAKE_GAME:
    case MAKING_GAME_ACTION_TYPES.SUCCEED_TO_MAKE_GAME: {
      return state.set('isMaking', false);
    }

    case ACTION_TYPES.FAILED_TO_GET_ALL_SLOT_MACHINES:
    case ACTION_TYPES.FAILED_TO_GET_MY_SLOT_MACHINES: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', false).set('hasError', true);
      });
    }

    case ACTION_TYPES.START_TO_GET_MY_SLOT_MACHINES: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', true).set('hasError', false);
      });
    }

    case ACTION_TYPES.TOGGLE_SORTING_DROPDOWN: {
      return state.set('isSortDropdownOpen', !state.get('isSortDropdownOpen'));
    }

    case ACTION_TYPES.CHANGE_SORTING_OPTION: {
      return state.set('sortOption', action.payload.option);
    }

    default:
      return state;
  }
}
