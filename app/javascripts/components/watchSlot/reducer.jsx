import { fromJS } from 'immutable';
import { ACTION_TYPES } from './actions';
import Web3Service from '../../helpers/web3Service';
import Big from 'big.js';

export const WATCH_SLOT_INITIAL_STATE = fromJS({
  isLoading: false,
  animationStatus: 0, // 0(stopped), 1(spinning), 2(going to stopped)
  hasError: false,
  betSize: Big(20),
  lineNum: 20,
  deposit: 0,
  bankRoll: 0,
  betUnit: 2,
  minBet: 2,
  maxBet: 20,
  slotMachineContract: null,
  slotName: '',
  initQueue: [],
  confirmQueue: [],
  chainIndex: 0,
  playerAddress: '',
  setIntervalTimerId: null,
});

export function reducer(state = WATCH_SLOT_INITIAL_STATE, action) {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': {
      const setIntervalTimerId = state.get('setIntervalTimerId');
      if (setIntervalTimerId !== null) {
        clearInterval(setIntervalTimerId);
        return state.set('setIntervalTimerId', null);
      }
    }
    case ACTION_TYPES.START_TO_SEND_ETHER_TO_CONTRACT:
    case ACTION_TYPES.START_TO_GET_SLOT_MACHINE: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', true).set('hasError', false);
      });
    }

    case ACTION_TYPES.FAILED_TO_GET_SLOT_MACHINE: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', false).set('hasError', true);
      });
    }

    case ACTION_TYPES.SET_PLAYER_ADDRESS: {
      return state.set('playerAddress', action.payload.playerAddress);
    }

    case ACTION_TYPES.SET_DEPOSIT: {
      return state.set('deposit', action.payload.deposit);
    }

    case ACTION_TYPES.SUCCEEDED_TO_GET_SLOT_MACHINE: {
      return state.withMutations(currentState => {
        return currentState
          .set('isLoading', false)
          .set('hasError', false)
          .set('minBet', action.payload.minBet)
          .set('betSize', action.payload.minBet)
          .set('maxBet', action.payload.maxBet)
          .set('betUnit', action.payload.minBet)
          .set('bankRoll', action.payload.bankRoll) // Big Number
          .set('deposit', action.payload.deposit) // Big Number
          .set('slotMachineContract', action.slotMachineContract)
          .set('slotName', action.payload.slotName)
          .set('playerAddress', action.payload.mPlayer);
      });
    }

    case ACTION_TYPES.SPIN_START: {
      return state.withMutations(currentState => {
        return currentState
          .set('animationStatus', 1)
          .set('lineNum', action.payload.lineNum)
          .set('betSize', action.payload.betSize)
          .set('chainIndex', action.payload.chainIndex);
      });
    }

    case ACTION_TYPES.STOP_START: {
      return state.withMutations(currentState => {
        const betAmount = currentState.get('betSize').times(currentState.get('lineNum'));
        const diffMoney = action.payload.winMoney.minus(betAmount);
        return currentState
          .set('animationStatus', 2)
          .set('deposit', currentState.get('deposit').plus(diffMoney))
          .set('bankRoll', currentState.get('bankRoll').minus(diffMoney));
      });
    }

    case ACTION_TYPES.STOP_END: {
      return state.set('animationStatus', 0);
    }

    case ACTION_TYPES.PUSH_INIT_EVENT: {
      return state.update('initQueue', list => list.push(action.payload.gameInfo));
    }

    case ACTION_TYPES.SHIFT_INIT_EVENT: {
      return state.withMutations(currentState => {
        const updatedDeposit =
          currentState.get('deposit') -
          currentState.get('initQueue').get(0).betSize * currentState.get('initQueue').get(0).lineNum;
        return currentState
          .set('isPlaying', true)
          .set('deposit', updatedDeposit)
          .set('betSize', currentState.get('initQueue').get(0).betSize)
          .set('lineNum', currentState.get('initQueue').get(0).lineNum)
          .shift('initQueue');
      });
    }

    case ACTION_TYPES.PUSH_CONFIRM_EVENT: {
      return state.update('confirmQueue', list => list.push(action.payload));
    }

    case ACTION_TYPES.SHIFT_CONFIRM_EVENT: {
      return state.update('confirmQueue', list => list.delete(action.queueIndex));
    }

    case ACTION_TYPES.START_TO_KICK_PLAYER: {
      return state.set('isLoading', true);
    }

    case ACTION_TYPES.FAILED_TO_KICK_PLAYER: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', false).set('hasError', true);
      });
    }

    case ACTION_TYPES.SUCCEEDED_TO_KICK_PLAYER: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', false).set('player', '');
      });
    }

    case ACTION_TYPES.START_TO_WATCH_MY_SLOT_MACHINES: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', true).set('hasError', false);
      });
    }
    case ACTION_TYPES.SUCCEEDED_TO_WATCH_MY_SLOT_MACHINES: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', false).set('setIntervalTimerId', action.payload.timerId);
      });
    }
    case ACTION_TYPES.FAILED_TO_WATCH_MY_SLOT_MACHINES: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', false).set('hasError', true);
      });
    }

    default:
      return state;
  }
}
