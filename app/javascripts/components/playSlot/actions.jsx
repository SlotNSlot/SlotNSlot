import { push } from 'react-router-redux';
import Web3Service from '../../helpers/web3Service';
import Toast from '../../helpers/notieHelper';

export const ACTION_TYPES = {
  SET_BET_SIZE: 'play_slot.SET_BET_SIZE',
  SET_LINE_NUM: 'play_slot.SET_LINE_NUM',
  SET_BANK_ROLL: 'play_slot.SET_BANK_ROLL',
  SPIN_START: 'play_slot.SPIN_START',
  SPIN_END: 'play_slot.SPIN_END',
  TOGGLE_EMOTION: 'play_slot.TOGGLE_EMOTION',
  SET_CATEGORY: 'play_slot.SET_CATEGORY',

  START_TO_GET_SLOT_MACHINE: 'play_slot.START_TO_GET_SLOT_MACHINE',
  SUCCEEDED_TO_GET_SLOT_MACHINE: 'play_slot.SUCCEED_TO_GET_SLOT_MACHINE',
  FAILED_TO_GET_SLOT_MACHINE: 'play_slot.FAILED_TO_GET_SLOT_MACHINE',

  START_TO_PLAY_GAME: 'play_slot.START_TO_PLAY_GAME',
  SUCCEEDED_TO_PLAY_GAME: 'play_slot.SUCCEED_TO_PLAY_GAME',
  FAILED_TO_PLAY_GAME: 'play_slot.FAILED_TO_PLAY_GAME',
};

export function getSlotMachine(slotAddress) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.START_TO_GET_SLOT_MACHINE,
    });

    try {
      const slotMachineContract = Web3Service.getSlotMachineContract(slotAddress);
      await Web3Service.getSlotMachineInfo(slotMachineContract)
        .then(payload => {
          dispatch({
            type: ACTION_TYPES.SUCCEEDED_TO_GET_SLOT_MACHINE,
            payload,
            slotMachineContract,
          });
        })
        .catch(reason => {
          dispatch({
            type: ACTION_TYPES.FAILED_TO_GET_SLOT_MACHINE,
          });
          Toast.notie.alert({
            type: 'error',
            text: `There was an error for accessing this slot machine. ${reason}`,
            stay: true,
          });
          dispatch(push('/slot/play'));
        });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.FAILED_TO_GET_SLOT_MACHINE,
      });
    }
  };
}

export function requestToPlayGame(playInfo, stopSpinFunc) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.START_TO_PLAY_GAME,
    });
    try {
      const transaction = await Web3Service.playSlotMachine(playInfo);
      stopSpinFunc(100);
      dispatch({
        type: ACTION_TYPES.SUCCEEDED_TO_PLAY_GAME,
        payload: transaction,
      });
    } catch (err) {
      Toast.notie.alert({
        type: 'error',
        text: 'There was an error for playing a slot machine',
        stay: true,
      });
      dispatch({
        type: ACTION_TYPES.FAILED_TO_PLAY_GAME,
      });
    }
  };
}

export function setBetSize(betSize) {
  return {
    type: ACTION_TYPES.SET_BET_SIZE,
    payload: {
      betSize,
    },
  };
}

export function setLineNum(lineNum) {
  return {
    type: ACTION_TYPES.SET_LINE_NUM,
    payload: {
      lineNum,
    },
  };
}

export function setBankRoll(bankRoll) {
  return {
    type: ACTION_TYPES.SET_BANK_ROLL,
    payload: {
      bankRoll,
    },
  };
}

export function toggleEmotion() {
  return {
    type: ACTION_TYPES.TOGGLE_EMOTION,
  };
}

export function setCategory(tableNum) {
  return {
    type: ACTION_TYPES.SET_CATEGORY,
    payload: {
      tableNum,
    },
  };
}
