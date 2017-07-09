jest.unmock('../actions');
jest.mock('../../helpers/web3Service');

import * as Actions from '../actions';

describe('Root Component Action Creators', () => {
  describe('setCoinBalance action creator', () => {
    it('should return SET_TOTAL_COIN_BALANCE action with proper balance payload', () => {
      expect(Actions.setCoinBalance('balance')).toEqual({
        type: Actions.ACTION_TYPES.SET_TOTAL_COIN_BALANCE,
        payload: {
          balance: 'balance',
        },
      });
    });
  });
});
