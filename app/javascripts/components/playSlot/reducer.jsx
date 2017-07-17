import { fromJS } from 'immutable';
import { ACTION_TYPES } from './actions';

const emotionTypes = ['Thank', 'Threaten', 'Oops', 'Sorry', 'Well Played', 'Greetings'];

const _betsData = [];
for (let i = 0; i < 45; i += 1) {
  _betsData.push({
    id: Math.floor(Math.random() * 4 + 1),
    time: `17.07.0${Math.floor(Math.random() * 9 + 1)}`,
    bet: Math.floor(Math.random() * 30 + 1) * 100,
    result: 'success',
    profit: Math.floor(Math.random() * 20 - 10) * 100,
  });
}

export const PLAY_SLOT_INITIAL_STATE = fromJS({
  betSize: 4,
  lineNum: 1,
  bankRoll: 2000,
  betUnit: 2,
  minBet: 2,
  maxBet: 20,
  isSpinning: false,
  emotionClicked: 0,
  emotionList: emotionTypes,
  betsData: _betsData,
  tableCategory: 0,
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
      return state.set('emotionClicked', state.get('emotionClicked') ^ 1);
    }

    case ACTION_TYPES.SET_CATEGORY: {
      return state.set('tableCategory', action.payload.tableNum);
    }

    default:
      return state;
  }
}
