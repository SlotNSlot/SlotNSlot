import { List } from 'immutable';
import { ACTION_TYPES } from './actions';

const SORT_OPTIONS = {
  lastActive: 'Last Active',
};

export const SLOT_LIST_INITIAL_STATE = fromJS({
  isLoading: false,
  hasError: false,
  sortOption: SORT_OPTIONS.lastActive,
  slots: List(),
  page: 1,
});

export function reducer(state = SLOT_LIST_INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPES.START_TO_GET_SLOT_MACHINES: {
      return state;
    }

    default:
      return state;
  }
}
