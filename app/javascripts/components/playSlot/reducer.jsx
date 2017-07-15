import { fromJS } from 'immutable';
import { ACTION_TYPES } from './actions';

const emotionTypes = ['Thank', 'Threaten', 'Oops', 'Sorry', 'Well Played', 'Greetings'];

export const PLAY_SLOT_INITIAL_STATE = fromJS({
  betSize: 4,
  lineNum: 1,
  bankRoll: 2000,
  betUnit: 2,
  minBet: 2,
  maxBet: 20,
  isSpinning: false,
  isClicked: 0,
  emotionList: emotionTypes,
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

    case ACTION_TYPES.TOGGLE_EMOTION: {
      return state.set('isClicked', state.get('isClicked') ^ 1);
    }

    default:
      return state;
  }
}
