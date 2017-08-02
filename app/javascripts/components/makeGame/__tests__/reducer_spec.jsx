jest.unmock('../reducer');
jest.unmock('../actions');

import { MAKE_GAME_INITIAL_STATE, reducer } from '../reducer';
import { ACTION_TYPES } from '../actions';

describe('Root Reducer', () => {
  let mockAction;
  let mockState;

  describe('when receive START_TO_MAKE_GAME type action', () => {
    it('should set isLoading state to true & hasFailed state to false', () => {
      mockAction = {
        type: ACTION_TYPES.START_TO_MAKE_GAME,
      };

      expect(reducer(MAKE_GAME_INITIAL_STATE, mockAction).get('isLoading')).toBeTruthy();
      expect(reducer(MAKE_GAME_INITIAL_STATE, mockAction).get('hasFailed')).toBeFalsy();
    });
  });

  describe('when receive SUCCEED_TO_MAKE_GAME type action', () => {
    it('should set isLoading state to false & hasFailed state to false', () => {
      mockState = MAKE_GAME_INITIAL_STATE.set('hasFailed', true).set('isLoading', true);
      mockAction = {
        type: ACTION_TYPES.SUCCEED_TO_MAKE_GAME,
      };

      expect(reducer(mockState, mockAction).get('isLoading')).toBeFalsy();
      expect(reducer(mockState, mockAction).get('hasFailed')).toBeFalsy();
    });
  });

  describe('when receive FAILED_TO_MAKE_GAME type action', () => {
    it('should set isLoading state to false & hasFailed state to true', () => {
      mockState = MAKE_GAME_INITIAL_STATE.set('isLoading', true);
      mockAction = {
        type: ACTION_TYPES.FAILED_TO_MAKE_GAME,
      };

      expect(reducer(mockState, mockAction).get('isLoading')).toBeFalsy();
      expect(reducer(mockState, mockAction).get('hasFailed')).toBeTruthy();
    });
  });

  describe('when receive SELECT_HIT_RATIO type action', () => {
    describe("when payload's hitRatio value is included in AVAILABLE_HIT_RATIO", () => {
      it("should set hitRatio state to payload's hitRatio", () => {
        mockAction = {
          type: ACTION_TYPES.SELECT_HIT_RATIO,
          payload: {
            hitRatio: 10,
          },
        };

        expect(reducer(MAKE_GAME_INITIAL_STATE, mockAction).get('hitRatio')).toEqual(10);
      });
    });

    describe("when payload's hitRatio value isn't included in AVAILABLE_HIT_RATIO", () => {
      it("should set hitRatio state to payload's hitRatio", () => {
        mockAction = {
          type: ACTION_TYPES.SELECT_HIT_RATIO,
          payload: {
            hitRatio: 5,
          },
        };

        expect(reducer(MAKE_GAME_INITIAL_STATE, mockAction).get('hitRatio')).toEqual(null);
      });
    });
  });

  describe('when receive CHANGE_TOTAL_STAKE type action', () => {
    it("should set totalStake state to payload's totalStake", () => {
      mockAction = {
        type: ACTION_TYPES.CHANGE_TOTAL_STAKE,
        payload: {
          totalStake: 100,
        },
      };

      expect(reducer(MAKE_GAME_INITIAL_STATE, mockAction).get('totalStake')).toEqual(100);
    });
  });

  describe('when receive SET_MAX_PRIZE type action', () => {
    it("should set maxPrize state to payload's maxPrize", () => {
      mockAction = {
        type: ACTION_TYPES.SET_MAX_PRIZE,
        payload: {
          maxPrize: 100,
        },
      };

      expect(reducer(MAKE_GAME_INITIAL_STATE, mockAction).get('maxPrize')).toEqual(100);
    });
  });

  describe('when receive SET_BET_MIN_VALUE type action', () => {
    it("should set betMinValue state to payload's betMinValue", () => {
      mockAction = {
        type: ACTION_TYPES.SET_BET_MIN_VALUE,
        payload: {
          value: 100,
        },
      };

      expect(reducer(MAKE_GAME_INITIAL_STATE, mockAction).get('betMinValue')).toEqual(100);
    });
  });

  describe('when receive SET_BET_MAX_VALUE type action', () => {
    it("should set betMaxValue state to payload's betMaxValue", () => {
      mockAction = {
        type: ACTION_TYPES.SET_BET_MAX_VALUE,
        payload: {
          value: 100,
        },
      };

      expect(reducer(MAKE_GAME_INITIAL_STATE, mockAction).get('betMaxValue')).toEqual(100);
    });
  });

  describe('when receive SET_SLOT_NAME type action', () => {
    it("should set slotName state to payload's slotName", () => {
      mockAction = {
        type: ACTION_TYPES.SET_SLOT_NAME,
        payload: {
          slotName: 'my slot machine',
        },
      };

      expect(reducer(MAKE_GAME_INITIAL_STATE, mockAction).get('slotName')).toEqual('my slot machine');
    });
  });
});
