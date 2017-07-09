jest.unmock('../reducer');
jest.unmock('../actions');

import { ROOT_INITIAL_STATE, reducer } from '../reducer';
import { ACTION_TYPES } from '../actions';

describe('Root Reducer', () => {
  let mockAction;
  let mockState;

  describe('when receive START_TO_GET_ACCOUNT type action', () => {
    it('should set isLoading state to true & hasError state to false', () => {
      mockState = ROOT_INITIAL_STATE.set('hasError', true);
      mockAction = {
        type: ACTION_TYPES.START_TO_GET_ACCOUNT,
      };

      expect(reducer(ROOT_INITIAL_STATE, mockAction).get('isLoading')).toBeTruthy();
      expect(reducer(ROOT_INITIAL_STATE, mockAction).get('hasError')).toBeFalsy();
    });
  });

  describe('when receive FETCH_ACCOUNT type action', () => {
    it("should set isLoading to false and accounts, account to payload's property", () => {
      mockState = ROOT_INITIAL_STATE.set('isLoading', true);
      mockAction = {
        type: ACTION_TYPES.FETCH_ACCOUNT,
        payload: {
          accounts: ['mockAccounts'],
          account: 'mockAccount',
        },
      };

      const result = reducer(mockState, mockAction);
      expect(result.get('isLoading')).toBeFalsy();
      expect(result.get('accounts')).toEqual(['mockAccounts']);
      expect(result.get('account')).toEqual('mockAccount');
    });
  });

  describe('when receive FAILED_TO_GET_ACCOUNT type action', () => {
    it('should set isLoading state to false & hasError state to true', () => {
      mockState = ROOT_INITIAL_STATE.set('isLoading', true);
      mockAction = {
        type: ACTION_TYPES.FAILED_TO_GET_ACCOUNT,
      };

      const result = reducer(mockState, mockAction);
      expect(result.get('isLoading')).toBeFalsy();
      expect(result.get('hasError')).toBeTruthy();
    });
  });

  describe('when receive SET_TOTAL_COIN_BALANCE type action', () => {
    it("should set balance state to payload's balance", () => {
      mockAction = {
        type: ACTION_TYPES.SET_TOTAL_COIN_BALANCE,
        payload: {
          balance: 12345,
        },
      };

      const result = reducer(ROOT_INITIAL_STATE, mockAction);
      expect(result.get('balance')).toEqual(12345);
    });
  });
});
