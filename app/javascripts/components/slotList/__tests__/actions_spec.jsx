jest.unmock('../actions');
jest.mock('../../../helpers/web3Service');

import * as Actions from '../actions';
import { List } from 'immutable';
import getMockStore from '../../../__tests__/mockStore';

describe('Slot List Component Action Creators', () => {
  const store = getMockStore();

  const mockSlotMachineContract = {
    abi: [1, 2, 3, 4, 6],
    address: '3uisdfjksdnc3j2',
    minBet: 0.001,
    maxBet: 0.003,
    name: 'mockSlotMachine',
  };

  beforeEach(() => {
    store.clearActions();
  });

  describe('getMySlotMachines action creator', () => {
    describe('when fetching is succeeded', () => {
      it('should return START_TO_GET_MY_SLOT_MACHINES & SUCCEEDED_TO_GET_MY_SLOT_MACHINES actions with proper balance payload', async () => {
        await store.dispatch(Actions.getMySlotMachines('dsfsdvcxvcvwefwfwcdscsdf'));
        const actions = await store.getActions();

        expect(actions[0].type).toEqual(Actions.ACTION_TYPES.START_TO_GET_MY_SLOT_MACHINES);
        expect(actions[1]).toEqual({
          type: Actions.ACTION_TYPES.SUCCEEDED_TO_GET_MY_SLOT_MACHINES,
          payload: {
            slotContracts: List([mockSlotMachineContract, mockSlotMachineContract, mockSlotMachineContract]),
          },
        });
      });
    });

    describe('when fetching is failed', () => {
      it('should return START_TO_GET_MY_SLOT_MACHINES & SUCCEEDED_TO_GET_MY_SLOT_MACHINES actions with proper balance payload', async () => {
        await store.dispatch(Actions.getMySlotMachines('forceFail'));
        const actions = await store.getActions();

        expect(actions[0].type).toEqual(Actions.ACTION_TYPES.START_TO_GET_MY_SLOT_MACHINES);
        expect(actions[1].type).toEqual(Actions.ACTION_TYPES.FAILED_TO_GET_MY_SLOT_MACHINES);
      });
    });
  });

  describe('getAllSlotMachines action creator', () => {
    describe('when fetching is succeeded', () => {
      it('should return START_TO_GET_ALL_SLOT_MACHINES & SUCCEEDED_TO_GET_ALL_SLOT_MACHINES actions with proper balance payload', async () => {
        await store.dispatch(Actions.getAllSlotMachines('dsfsdvcxvcvwefwfwcdscsdf'));
        const actions = await store.getActions();

        expect(actions[0].type).toEqual(Actions.ACTION_TYPES.START_TO_GET_ALL_SLOT_MACHINES);
        expect(actions[1]).toEqual({
          type: Actions.ACTION_TYPES.SUCCEEDED_TO_GET_ALL_SLOT_MACHINES,
          payload: {
            slotContracts: List([
              mockSlotMachineContract,
              mockSlotMachineContract,
              mockSlotMachineContract,
              mockSlotMachineContract,
              mockSlotMachineContract,
              mockSlotMachineContract,
              mockSlotMachineContract,
              mockSlotMachineContract,
              mockSlotMachineContract,
            ]),
          },
        });
      });
    });

    describe('when fetching is failed', () => {
      it('should return START_TO_GET_MY_SLOT_MACHINES & SUCCEEDED_TO_GET_MY_SLOT_MACHINES actions with proper balance payload', async () => {
        await store.dispatch(Actions.getMySlotMachines('forceFail'));
        const actions = await store.getActions();

        expect(actions[0].type).toEqual(Actions.ACTION_TYPES.START_TO_GET_MY_SLOT_MACHINES);
        expect(actions[1].type).toEqual(Actions.ACTION_TYPES.FAILED_TO_GET_MY_SLOT_MACHINES);
      });
    });
  });

  describe('handleClickSortingOption action creator', () => {
    it('should return CHANGE_SORTING_OPTION action with proper payload', () => {
      store.dispatch(Actions.handleClickSortingOption('mockOption'));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: Actions.ACTION_TYPES.CHANGE_SORTING_OPTION,
        payload: {
          option: 'mockOption',
        },
      });
    });
  });

  describe('handleSortDropdownOpen action creator', () => {
    it('should return TOGGLE_SORTING_DROPDOWN action', () => {
      store.dispatch(Actions.handleSortDropdownOpen());
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: Actions.ACTION_TYPES.TOGGLE_SORTING_DROPDOWN,
      });
    });
  });
});
