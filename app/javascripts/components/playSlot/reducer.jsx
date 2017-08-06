import { fromJS } from 'immutable';
import Big from 'big.js';
import { ACTION_TYPES } from './actions';
import Web3Service from '../../helpers/web3Service';

const emotionTypes = ['Thank', 'Threaten', 'Oops', 'Sorry', 'Well Played', 'Greetings'];

export const PLAY_SLOT_INITIAL_STATE = fromJS({
  isLoading: false,
  isPlaying: false,
  isOccupied: false,
  hasError: false,
  betSize: Big(20),
  lineNum: 20,
  deposit: 0,
  bankRoll: 0,
  betUnit: 2,
  minBet: 2,
  maxBet: 20,
  emotionClicked: 0,
  emotionList: emotionTypes,
  betsData: [],
  tableCategory: 0,
  slotMachineContract: null,
  slotName: '',
});

export function reducer(state = PLAY_SLOT_INITIAL_STATE, action) {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': {
      // for initializing slot Info
      if (state !== PLAY_SLOT_INITIAL_STATE) {
        return PLAY_SLOT_INITIAL_STATE;
      }
      return state;
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

    case ACTION_TYPES.SET_DEPOSIT: {
      return state.set('deposit', action.payload.ethValue);
    }

    case ACTION_TYPES.SET_OCCUPIED_STATE: {
      return state.set('isOccupied', action.payload.occupied);
    }

    case ACTION_TYPES.SUCCEEDED_TO_GET_SLOT_MACHINE: {
      return state.withMutations(currentState => {
        return currentState
          .set('isLoading', false)
          .set('hasError', false)
          .set('minBet', action.payload.minBet) // Big Number
          .set('betSize', action.payload.minBet) // Big Number
          .set('maxBet', action.payload.maxBet) // Big Number
          .set('betUnit', action.payload.minBet) // Big Number
          .set('bankRoll', action.payload.bankRoll) // Big Number
          .set('deposit', action.payload.deposit) // Big Number
          .set('slotMachineContract', action.slotMachineContract)
          .set('slotName', action.payload.slotName);
      });
    }

    case ACTION_TYPES.SEND_ETHER_TO_SLOT_CONTRACT: {
      return state.withMutations(currentState => {
        const bigNumber = Web3Service.getWeb3().toBigNumber(
          parseFloat(action.payload.weiValue, 10) + parseFloat(currentState.get('deposit'), 10),
        );
        return currentState.set('deposit', bigNumber).set('isLoading', false).set('hasError', false);
      });
    }

    case ACTION_TYPES.START_TO_OCCUPY_SLOT_MACHINE: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', true).set('hasError', false);
      });
    }

    case ACTION_TYPES.FAILED_TO_SEND_ETHER_TO_CONTRACT:
    case ACTION_TYPES.FAILED_TO_OCCUPY_SLOT_MACHINE: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', false).set('hasError', true);
      });
    }

    case ACTION_TYPES.SUCCEEDED_TO_OCCUPY_SLOT_MACHINE: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', false).set('hasError', false).set('isOccupied', true);
      });
    }

    case ACTION_TYPES.START_TO_PLAY_GAME: {
      return state.withMutations(currentState => {
        return currentState.set('isPlaying', true).set('hasError', false);
      });
    }

    case ACTION_TYPES.FAILED_TO_PLAY_GAME: {
      return state.withMutations(currentState => {
        action.payload.transaction.id = currentState.get('betsData').size + 1;
        return currentState.set('hasError', true).update('betsData', list => list.push(action.payload.transaction));
      });
    }

    case ACTION_TYPES.SUCCEEDED_TO_PLAY_GAME: {
      return state.withMutations(currentState => {
        action.payload.transaction.id = currentState.get('betsData').size + 1;
        return currentState
          .set('isPlaying', false)
          .set('deposit', currentState.get('deposit').plus(parseFloat(action.payload.diffMoney, 10)))
          .set('bankRoll', currentState.get('bankRoll').minus(parseFloat(action.payload.diffMoney, 10)))
          .update('betsData', list => list.push(action.payload.transaction));
      });
    }

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
