import { fromJS } from 'immutable';
import { ACTION_TYPES } from './actions';

const _second = 1000;
const _minute = _second * 60;
const _hour = _minute * 60;
const _day = _hour * 24;
const dueDate = new Date('2017-09-17T08:00:00.000Z'); // Crowdsale End date
const initDate = new Date();

function timeFormat(time) {
  if (time < 0) return '00';
  else {
    const num = Math.floor(time);
    return num < 10 ? `0${num}` : num;
  }
}

export const CONTRIBUTE_PAGE_INITIAL_STATE = fromJS({
  days: timeFormat((dueDate - initDate) / _day),
  hours: timeFormat((dueDate - initDate) % _day / _hour),
  minutes: timeFormat((dueDate - initDate) % _hour / _minute),
  seconds: timeFormat((dueDate - initDate) % _minute / _second),

  currentEther: 0,
  checkTerms: false,
  checkResident: false,
  allAgreed: false,
});

export function reducer(state = CONTRIBUTE_PAGE_INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_COUNTDOWN: {
      const curDate = new Date();
      return state.withMutations(currentState => {
        return currentState
          .set('days', timeFormat((dueDate - curDate) / _day))
          .set('hours', timeFormat((dueDate - curDate) % _day / _hour))
          .set('minutes', timeFormat((dueDate - curDate) % _hour / _minute))
          .set('seconds', timeFormat((dueDate - curDate) % _minute / _second));
      });
    }

    case ACTION_TYPES.UPDATE_CURRENT_ETHER: {
      return state.set('currentEther', action.payload.currentEther);
    }

    case ACTION_TYPES.AGREE_TERMS_CONDITION: {
      const curState = state.get('checkTerms');
      return state.set('checkTerms', !curState);
    }

    case ACTION_TYPES.AGREE_LEGAL_RESIDENT: {
      const curState = state.get('checkResident');
      return state.set('checkResident', !curState);
    }

    case ACTION_TYPES.AGREED_ALL_CHECKBOX: {
      return state.set('allAgree', true);
    }

    default:
      return state;
  }
}
