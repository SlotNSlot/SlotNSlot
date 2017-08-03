import { push } from 'react-router-redux';
import moment from 'moment';
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
  SET_OCCUPIED_STATE: 'play_slot.SET_OCCUPIED_STATE',

  START_TO_GET_SLOT_MACHINE: 'play_slot.START_TO_GET_SLOT_MACHINE',
  SUCCEEDED_TO_GET_SLOT_MACHINE: 'play_slot.SUCCEED_TO_GET_SLOT_MACHINE',
  FAILED_TO_GET_SLOT_MACHINE: 'play_slot.FAILED_TO_GET_SLOT_MACHINE',
  SUCCEEDED_TO_OCCUPY_SLOT_MACHINE: 'play_slot.SUCCEED_TO_OCCUPY_SLOT_MACHINE',
  FAILED_TO_OCCUPY_SLOT_MACHINE: 'play_slot.FAILED_TO_OCCUPY_SLOT_MACHINE',

  START_TO_OCCUPY_SLOT_MACHINE: 'play_slot.START_TO_OCCUPY_SLOT_MACHINE',
  SET_DEPOSIT: 'play_slot.SET_DEPOSIT',
  START_TO_PLAY_GAME: 'play_slot.START_TO_PLAY_GAME',
  SUCCEEDED_TO_PLAY_GAME: 'play_slot.SUCCEEDED_TO_PLAY_GAME',
  FAILED_TO_PLAY_GAME: 'play_slot.FAILED_TO_PLAY_GAME',

  START_TO_SEND_ETHER_TO_CONTRACT: 'play_slot.START_TO_SEND_ETHER_TO_CONTRACT',
  SEND_ETHER_TO_SLOT_CONTRACT: 'play_slot.SEND_ETHER_TO_SLOT_CONTRACT',
  FAILED_TO_SEND_ETHER_TO_CONTRACT: 'play_slot.FAILED_TO_SEND_ETHER_TO_CONTRACT',
};

export function setDeposit(ethValue) {
  return {
    type: ACTION_TYPES.SET_DEPOSIT,
    payload: {
      ethValue,
    },
  };
}

export function sendEtherToSlotContract(slotMachineContract, playerAccount, weiValue) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.START_TO_SEND_ETHER_TO_CONTRACT,
    });

    try {
      await Web3Service.sendEtherToAccount({
        from: playerAccount,
        to: slotMachineContract.address,
        etherValue: Web3Service.makeEthFromWei(weiValue),
      });

      dispatch({
        type: ACTION_TYPES.SEND_ETHER_TO_SLOT_CONTRACT,
        payload: {
          weiValue,
        },
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: ACTION_TYPES.FAILED_TO_SEND_ETHER_TO_CONTRACT,
      });
    }
  };
}

export function setOccupiedState(isOccupied) {
  return {
    type: ACTION_TYPES.SET_OCCUPIED_STATE,
    payload: {
      occupied: isOccupied,
    },
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

export function occupySlotMachine(slotMachineContract, playerAddress, weiValue) {
  return async dispatch => {
    const slotInfo = await Web3Service.getSlotMachineInfo(slotMachineContract);
    if (slotInfo.mPlayer === playerAddress) {
      alert('game is already occupied');
      return;
    }

    if (!weiValue) {
      alert('You should set deposit');
      return;
    }

    dispatch({
      type: ACTION_TYPES.START_TO_OCCUPY_SLOT_MACHINE,
    });

    try {
      await Web3Service.occupySlotMachine(slotMachineContract, playerAddress, weiValue);
      dispatch({
        type: ACTION_TYPES.SUCCEEDED_TO_OCCUPY_SLOT_MACHINE,
      });
    } catch (err) {
      Toast.notie.alert({
        type: 'error',
        text: `There was an error for occupying this slot machine. ${err}`,
        stay: true,
      });
      dispatch({
        type: ACTION_TYPES.FAILED_TO_OCCUPY_SLOT_MACHINE,
      });
    }
  };
}

export function leaveSlotMachine(slotContract, playerAddress) {
  return async dispatch => {
    try {
      await Web3Service.leaveSlotMachine(slotContract, playerAddress);
      dispatch(push('/slot/play'));
    } catch (err) {
      console.error(err);
    }
  };
}

export function requestToPlayGame(playInfo, stopSpinFunc) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.START_TO_PLAY_GAME,
    });
    const rewardPromise = Web3Service.getSlotResult(playInfo.slotMachineContract);
    const playPromise = Web3Service.playSlotMachine(playInfo);
    await Promise.all([rewardPromise, playPromise])
      .then(result => {
        const ethReward = result[0];
        const betMoney = playInfo.lineNum * playInfo.betSize;
        const diffMoney = ethReward.minus(betMoney);
        const transaction = {
          time: moment().format('YY.MM.DD H:mm:ss'),
          bet: `${betMoney.valueOf()} ETH`,
          result: 'success',
          profit: `${diffMoney.valueOf()} ETH`,
        };
        stopSpinFunc(ethReward);
        dispatch({
          type: ACTION_TYPES.SUCCEEDED_TO_PLAY_GAME,
          payload: {
            transaction,
            diffMoney,
          },
        });
      })
      .catch(err => {
        console.log('err is ', err);
        Toast.notie.alert({
          type: 'error',
          text: 'There was an error for playing a slot machine',
          stay: true,
        });
        const transaction = {
          time: moment().format('YY.MM.DD H:mm:ss'),
          bet: '',
          result: 'fail',
          profit: '',
        };
        dispatch({
          type: ACTION_TYPES.FAILED_TO_PLAY_GAME,
          payload: {
            transaction,
          },
        });
      });
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
