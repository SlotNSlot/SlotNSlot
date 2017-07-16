import { fromJS } from 'immutable';
import { ACTION_TYPES } from './actions';

export const PLAY_SLOT_INITIAL_STATE = fromJS({
  betSize: 20,
  lineNum: 20,
  bankRoll: 2000,
  betUnit: 2,
  minBet: 2,
  maxBet: 20,
  isSpinning: false,
});

export function reducer(state = PLAY_SLOT_INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_BET_SIZE: {
      return state.set('betSize', action.payload.betSize);
    }

    case ACTION_TYPES.SET_LINE_NUM: {
      return state.set('lineNum', action.payload.lineNum);
    }

    case ACTION_TYPES.SET_BANK_ROLL: {
      return state.set('bankRoll', action.payload.bankRoll);
    }

    case ACTION_TYPES.SPIN_START: {
      return state.set('isSpinning', true);
    }

    case ACTION_TYPES.SPIN_END: {
      return state.set('isSpinning', false);
    }
    default:
      return state;
  }
}
