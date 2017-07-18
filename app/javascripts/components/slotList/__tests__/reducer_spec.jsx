jest.unmock('../reducer');
jest.unmock('../actions');

import { List } from 'immutable';
import { SLOT_LIST_INITIAL_STATE, SORT_OPTIONS, reducer } from '../reducer';
import { ACTION_TYPES } from '../actions';

describe('Slot List Reducer', () => {
  let mockAction;
  let mockState;

  const mockContract = {
    abi: [],
    address: 'dsfkjhvjsdkjklfjsklfkjwekl',
  };

  describe('when receive START_TO_GET_ALL_SLOT_MACHINES type action', () => {
    it('should set isLoading state to true & hasError state to false', () => {
      mockState = SLOT_LIST_INITIAL_STATE.set('hasError', true);
      mockAction = {
        type: ACTION_TYPES.START_TO_GET_ALL_SLOT_MACHINES,
      };

      expect(reducer(mockState, mockAction).get('isLoading')).toBeTruthy();
      expect(reducer(mockState, mockAction).get('hasError')).toBeFalsy();
    });
  });

  describe('when receive FAILED_TO_GET_ALL_SLOT_MACHINES type action', () => {
    it('should set isLoading state to false & hasError state to true', () => {
      mockState = SLOT_LIST_INITIAL_STATE.set('isLoading', true);
      mockAction = {
        type: ACTION_TYPES.FAILED_TO_GET_ALL_SLOT_MACHINES,
      };

      expect(reducer(mockState, mockAction).get('isLoading')).toBeFalsy();
      expect(reducer(mockState, mockAction).get('hasError')).toBeTruthy();
    });
  });

  describe('when receive SUCCEEDED_TO_GET_ALL_SLOT_MACHINES type action', () => {
    it("should set isLoading state to false & set allSlotContracts by payload's value", () => {
      mockState = SLOT_LIST_INITIAL_STATE.set('isLoading', true);
      mockAction = {
        type: ACTION_TYPES.SUCCEEDED_TO_GET_ALL_SLOT_MACHINES,
        payload: {
          slotContracts: List([mockContract]),
        },
      };

      expect(reducer(mockState, mockAction).get('isLoading')).toBeFalsy();
      expect(reducer(mockState, mockAction).get('allSlotContracts')).toEqual(List([mockContract]));
    });
  });

  describe('when receive START_TO_GET_MY_SLOT_MACHINES type action', () => {
    it('should set isLoading state to true & hasError state to false', () => {
      mockState = SLOT_LIST_INITIAL_STATE.set('hasError', true);
      mockAction = {
        type: ACTION_TYPES.START_TO_GET_MY_SLOT_MACHINES,
      };

      expect(reducer(mockState, mockAction).get('isLoading')).toBeTruthy();
      expect(reducer(mockState, mockAction).get('hasError')).toBeFalsy();
    });
  });

  describe('when receive FAILED_TO_GET_MY_SLOT_MACHINES type action', () => {
    it('should set isLoading state to false & hasError state to true', () => {
      mockState = SLOT_LIST_INITIAL_STATE.set('isLoading', true);
      mockAction = {
        type: ACTION_TYPES.FAILED_TO_GET_MY_SLOT_MACHINES,
      };

      expect(reducer(mockState, mockAction).get('isLoading')).toBeFalsy();
      expect(reducer(mockState, mockAction).get('hasError')).toBeTruthy();
    });
  });

  describe('when receive SUCCEEDED_TO_GET_MY_SLOT_MACHINES type action', () => {
    it("should set isLoading state to false & set mySlotContracts by payload's value", () => {
      mockState = SLOT_LIST_INITIAL_STATE.set('isLoading', true);
      mockAction = {
        type: ACTION_TYPES.SUCCEEDED_TO_GET_MY_SLOT_MACHINES,
        payload: {
          slotContracts: List([mockContract]),
        },
      };

      expect(reducer(mockState, mockAction).get('isLoading')).toBeFalsy();
      expect(reducer(mockState, mockAction).get('mySlotContracts')).toEqual(List([mockContract]));
    });
  });

  describe('when receive TOGGLE_SORTING_DROPDOWN type action', () => {
    it('should set isSortDropdownOpen state to opposite of the current state', () => {
      mockState = SLOT_LIST_INITIAL_STATE.set('isSortDropdownOpen', true);
      mockAction = {
        type: ACTION_TYPES.TOGGLE_SORTING_DROPDOWN,
      };

      expect(reducer(mockState, mockAction).get('isSortDropdownOpen')).toBeFalsy();
    });
  });

  describe('when receive CHANGE_SORTING_OPTION type action', () => {
    it("should set sortOption state to payload's option value", () => {
      mockAction = {
        type: ACTION_TYPES.CHANGE_SORTING_OPTION,
        payload: {
          option: SORT_OPTIONS.highBetSize,
        },
      };

      expect(reducer(SLOT_LIST_INITIAL_STATE, mockAction).get('sortOption')).toEqual(SORT_OPTIONS.highBetSize);
    });
  });
});
