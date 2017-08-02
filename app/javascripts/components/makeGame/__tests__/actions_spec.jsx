jest.unmock('../actions');
jest.unmock('../../../root/actions');
jest.unmock('../../../__tests__/mockStore');
jest.unmock('../../../helpers/notieHelper');
jest.unmock('../../slotList/actions');

import * as Actions from '../actions';
import getMockStore from '../../../__tests__/mockStore';

describe('MakeGame Action Creators', () => {
  const store = getMockStore();

  beforeEach(() => {
    store.clearActions();
  });

  describe('selectHitRation action creator', () => {
    it('should return SELECT_HIT_RATIO action with proper hitRatio payload', () => {
      expect(Actions.selectHitRation(100)).toEqual({
        type: Actions.ACTION_TYPES.SELECT_HIT_RATIO,
        payload: {
          hitRatio: 100,
        },
      });
    });
  });

  describe('handleTotalStakeChange action creator', () => {
    it('should return CHANGE_TOTAL_STAKE action with proper totalStake payload', () => {
      expect(Actions.handleTotalStakeChange(100)).toEqual({
        type: Actions.ACTION_TYPES.CHANGE_TOTAL_STAKE,
        payload: {
          totalStake: 100,
        },
      });
    });
  });

  describe('setMaxPrize action creator', () => {
    it('should return SET_MAX_PRIZE action with proper maxPrize payload', () => {
      expect(Actions.setMaxPrize(100)).toEqual({
        type: Actions.ACTION_TYPES.SET_MAX_PRIZE,
        payload: {
          maxPrize: 100,
        },
      });
    });
  });

  describe('setBetMinValue action creator', () => {
    it('should return SET_BET_MIN_VALUE action with proper value payload', () => {
      expect(Actions.setBetMinValue(100)).toEqual({
        type: Actions.ACTION_TYPES.SET_BET_MIN_VALUE,
        payload: {
          value: 100,
        },
      });
    });
  });

  describe('setBetMaxValue action creator', () => {
    it('should return SET_BET_MAX_VALUE action with proper value payload', () => {
      expect(Actions.setBetMaxValue(100)).toEqual({
        type: Actions.ACTION_TYPES.SET_BET_MAX_VALUE,
        payload: {
          value: 100,
        },
      });
    });
  });

  describe('setSlotName action creator', () => {
    it('should return SET_SLOT_NAME action with proper slotName payload', () => {
      expect(Actions.setSlotName('my slot name')).toEqual({
        type: Actions.ACTION_TYPES.SET_SLOT_NAME,
        payload: {
          slotName: 'my slot name',
        },
      });
    });
  });

  describe('requestToMakeGame action creator', () => {
    // TODO: Enable below spec
    describe.skip('when request is succeeded', () => {
      it('should dispatch START_TO_MAKE_GAME & SUCCEED_TO_MAKE_GAME actions', async () => {
        await store.dispatch(
          Actions.requestToMakeGame({
            account: 'mockAccount',
            decider: 10000,
            minBet: 0.001,
            maxbet: 0.003,
            totalStake: 2,
          }),
        );
        const actions = await store.getActions();

        expect(actions[0].type).toEqual(Actions.ACTION_TYPES.START_TO_MAKE_GAME);
        expect(actions[1]).toEqual({
          type: Actions.ACTION_TYPES.SUCCEED_TO_MAKE_GAME,
          payload: {
            account: 'mockAccount',
          },
        });
      });
    });

    describe('when request is failed', () => {
      it('should dispatch START_TO_MAKE_GAME & SUCCEED_TO_MAKE_GAME actions', async () => {
        await store.dispatch(
          Actions.requestToMakeGame({
            account: 'forceFail',
            decider: 10000,
            minBet: 0.001,
            maxbet: 0.003,
            totalStake: 2,
          }),
        );
        const actions = await store.getActions();

        expect(actions[0].type).toEqual(Actions.ACTION_TYPES.START_TO_MAKE_GAME);
        expect(actions[1]).toEqual({
          type: Actions.ACTION_TYPES.FAILED_TO_MAKE_GAME,
        });
      });
    });
  });
});
