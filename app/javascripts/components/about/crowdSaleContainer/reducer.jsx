import { fromJS } from 'immutable';
import { ACTION_TYPES } from './actions';

const _second = 1000;
const _minute = _second * 60;
const _hour = _minute * 60;
const _day = _hour * 24;
const dueDate = new Date('2017-08-15T14:00:00.000Z');
const initDate = new Date();

function timeFormat(time) {
  if (time < 0) return '00';
  else {
    const num = Math.floor(time);
    return num < 10 ? `0${num}` : num;
  }
}

export const ABOUT_CROWDSALE_INITIAL_STATE = fromJS({
  days: timeFormat((dueDate - initDate) / _day),
  hours: timeFormat((dueDate - initDate) % _day / _hour),
  minutes: timeFormat((dueDate - initDate) % _hour / _minute),
  seconds: timeFormat((dueDate - initDate) % _minute / _second),
});

export function reducer(state = ABOUT_CROWDSALE_INITIAL_STATE, action) {
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

    default:
      return state;
  }
}
