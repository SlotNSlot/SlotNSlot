import { push } from 'react-router-redux';
import { fromJS } from 'immutable';
import Web3Service from '../../helpers/web3Service';
import Toast from '../../helpers/notieHelper';
import Store from 'store';
import { USER_TYPES } from '../slotList/actions';

export const ACTION_TYPES = {
  SET_OCCUPIED_STATE: 'watch_slot.SET_OCCUPIED_STATE',
  SPIN_START: 'watch_slot.SPIN_START',
  STOP_START: 'watch_slot.STOP_START',
  STOP_END: 'watch_slot.STOP_END',

  START_TO_GET_SLOT_MACHINE: 'watch_slot.START_TO_GET_SLOT_MACHINE',
  SUCCEEDED_TO_GET_SLOT_MACHINE: 'watch_slot.SUCCEED_TO_GET_SLOT_MACHINE',
  FAILED_TO_GET_SLOT_MACHINE: 'watch_slot.FAILED_TO_GET_SLOT_MACHINE',

  PUSH_INIT_EVENT: 'watch_slot.PUSH_INIT_EVENT',
  SHIFT_INIT_EVENT: 'watch_slot.SHIFT_INIT_EVENT',
  PUSH_CONFIRM_EVENT: 'watch_slot.PUSH_CONFIRM_EVENT',
  SHIFT_CONFIRM_EVENT: 'watch_slot.SHIFT_CONFIRM_EVENT',
};

export function setOccupiedState(isOccupied) {
  return {
    type: ACTION_TYPES.SET_OCCUPIED_STATE,
    payload: {
      occupied: isOccupied,
    },
  };
}

async function getSlotMachineInfo(slotMachineContractAddress, userType, myAccount = null) {
  const contract = Web3Service.getSlotMachineContract(slotMachineContractAddress);
  console.log('contract is ', contract);
  try {
    const slotInfo = await Web3Service.getSlotMachineInfo(contract, userType, myAccount);
    return {
      contract,
      meta: slotInfo,
    };
  } catch (err) {
    return null;
  }
}

export function getMySlotMachines(myAccount) {
  return async () => {
    try {
      const slotMachineAddressesArray = await Web3Service.getSlotMachinesFromBanker(myAccount);
      const promiseArr = [];
      slotMachineAddressesArray.forEach(slotMachineContractAddress => {
        promiseArr.push(getSlotMachineInfo(slotMachineContractAddress, USER_TYPES.MAKER, myAccount));
      });
      console.log('slotMachineAddressesArray is ', slotMachineAddressesArray);
      await Promise.all(promiseArr).then(resultArr => {
        const filteredArr = resultArr.filter(slotContractInfo => {
          return slotContractInfo !== null;
        });
        const slotContracts = fromJS(filteredArr);
        Web3Service.makerPendingWatcher(slotContracts, myAccount);
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function attachEventWatcher(slotAddress, eventHandler) {
  return async dispatch => {
    try {
      Web3Service.slotEventMonitor(slotAddress, eventHandler);
    } catch (error) {
      Toast.notie.alert({
        type: 'error',
        text: `Invalid Error: ${error}`,
        stay: true,
      });
      dispatch(push('/slot/make'));
    }
  };
}

export function getSlotMachine(slotAddress, playerAddress) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.START_TO_GET_SLOT_MACHINE,
    });

    try {
      const slotMachineContract = Web3Service.getSlotMachineContract(slotAddress);
      const slotInfo = await Web3Service.getSlotMachineInfo(slotMachineContract);

      // Set occupied state
      if (slotInfo.mPlayer === playerAddress) {
        dispatch(setOccupiedState(true));
      }

      dispatch({
        type: ACTION_TYPES.SUCCEEDED_TO_GET_SLOT_MACHINE,
        payload: slotInfo,
        slotMachineContract,
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.FAILED_TO_GET_SLOT_MACHINE,
      });

      Toast.notie.alert({
        type: 'error',
        text: `There was an error for accessing this slot machine. ${err}`,
        stay: true,
      });

      dispatch(push('/slot/play'));
    }
  };
}

export function removeSlotMachine(slotContract, playerAddress) {
  return async dispatch => {
    try {
      await Web3Service.removeSlotMachine(slotContract, playerAddress);
      dispatch(push('/slot/make'));
    } catch (err) {
      console.error(err);
    }
  };
}

export function pushInitEvent(gameInfo) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.PUSH_INIT_EVENT,
      payload: {
        betSize: gameInfo.betSize,
        lineNum: gameInfo.lineNum,
        chainIndex: gameInfo.chainIndex,
      },
    });
  };
}

export function shiftInitEvent() {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.SHIFT_INIT_EVENT,
    });
  };
}

export function pushConfirmEvent(gameResult) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.PUSH_CONFIRM_EVENT,
      payload: {
        winMoney: gameResult.winMoney,
        chainIndex: gameResult.chainIndex,
      },
    });
  };
}

export function shiftConfirmEvent(queueIndex) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.SHIFT_CONFIRM_EVENT,
      payload: {
        queueIndex,
      },
    });
  };
}

export function spinStart(gameInfo) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.SPIN_START,
      payload: {
        betSize: gameInfo.betSize,
        lineNum: gameInfo.lineNum,
        chainIndex: gameInfo.chainIndex,
      },
    });
  };
}

export function stopStart(gameResult) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.STOP_START,
      payload: {
        winMoney: gameResult.winMoney,
        chainIndex: gameResult.chainIndex,
      },
    });
  };
}

export function stopEnd() {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.STOP_END,
    });
  };
}
