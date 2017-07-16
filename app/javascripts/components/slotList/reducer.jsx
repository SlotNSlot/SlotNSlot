import { fromJS } from 'immutable';
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
  slots: [],
  page: 1,
});

export function reducer(state = SLOT_LIST_INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPES.START_TO_GET_SLOT_MACHINES: {
      return state;
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
