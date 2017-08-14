import { push } from 'react-router-redux';
import moment from 'moment';
import Web3Service from '../../helpers/web3Service';
import Toast from '../../helpers/notieHelper';
import { logException } from '../../helpers/errorLogger';
import { USER_TYPES, updateJustLeavedSlotAddress } from '../slotList/actions';
import { updateBalance } from '../../root/actions';

const WAIT_TIME_TO_OCCUPY_SLOT_MACHINE = 5000;
const NULL_PLAYER_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ACTION_TYPES = {
  SET_BET_SIZE: 'play_slot.SET_BET_SIZE',
  SET_LINE_NUM: 'play_slot.SET_LINE_NUM',
  SET_BANK_ROLL: 'play_slot.SET_BANK_ROLL',
  SPIN_START: 'play_slot.SPIN_START',
  SPIN_END: 'play_slot.SPIN_END',
  TOGGLE_EMOTION: 'play_slot.TOGGLE_EMOTION',
  SET_OCCUPIED_STATE: 'play_slot.SET_OCCUPIED_STATE',
  SET_WAIT_OCCUPY: 'play_slot.SET_WAIT_OCCUPY',

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

  UPDATE_BREAK_AWAY_TRY: 'play_slot.UPDATE_BREAK_AWAY_TRY',
  INITIALIZE_PLAY_SLOT_STATE: 'play_slot.INITIALIZE_PLAY_SLOT_STATE',
  UPDATE_BET_DATA_AFTER_STOP_SPIN: 'play_slot.UPDATE_BET_DATA_AFTER_STOP_SPIN',
};
export function setPlayerKickedByWatcher(slotMachineContractAddress, playerAddress) {
  return async dispatch => {
    try {
      const playerLeavedEventResult = await Web3Service.setPlayerKickedByWatcher(slotMachineContractAddress);
      const playerLeavedTransaction = Web3Service.web3.eth.getTransaction(playerLeavedEventResult.transactionHash);
      const playerLeavedEventData = playerLeavedEventResult.data.substr(2);
      const leavedEther = Web3Service.makeEthFromWei(`0x${playerLeavedEventData.substr(64, 64)}`);
      Web3Service.createGenesisRandomNumber(slotMachineContractAddress, USER_TYPES.PLAYER, true);
      dispatch(updateJustLeavedSlotAddress(slotMachineContractAddress));
      dispatch(updateBalance(leavedEther));
      dispatch({
        type: ACTION_TYPES.UPDATE_BREAK_AWAY_TRY,
        payload: {
          isBreakAway: false,
        },
      });
      if (playerLeavedTransaction.from !== playerAddress) {
        Toast.notie.alert({
          type: 'error',
          text: 'You are kicked by banker.',
          stay: true,
        });
      } else {
        Toast.notie.alert({
          text: `Your balance ${leavedEther} ETH in the slot has been withdrawn and put into your wallet.`,
          stay: true,
        });
      }
      dispatch(push('/slot/play'));
    } catch (err) {
      logException(err);
      console.err('setPlayerKickedByWatcher ', err);
    }
  };
}
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
        value: weiValue,
      });

      dispatch({
        type: ACTION_TYPES.SEND_ETHER_TO_SLOT_CONTRACT,
        payload: {
          ethValue: Web3Service.makeEthFromWei(weiValue),
        },
      });
    } catch (err) {
      logException(err);
      console.error(err);
      dispatch({
        type: ACTION_TYPES.FAILED_TO_SEND_ETHER_TO_CONTRACT,
      });
    }
  };
}

export function setOccupiedState(isOccupied) {
  const isBreakAway = isOccupied === true;
  return {
    type: ACTION_TYPES.SET_OCCUPIED_STATE,
    payload: {
      occupied: isOccupied,
      isBreakAway,
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
      } else if (slotInfo.mPlayer === NULL_PLAYER_ADDRESS) {
        dispatch(setOccupiedState(false));
      } else {
        throw new Error('Already user exists.');
      }
      dispatch({
        type: ACTION_TYPES.SUCCEEDED_TO_GET_SLOT_MACHINE,
        payload: slotInfo,
        slotMachineContract,
      });
    } catch (err) {
      logException(err);

      dispatch({
        type: ACTION_TYPES.UPDATE_BREAK_AWAY_TRY,
        payload: {
          isBreakAway: false,
        },
      });
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
      setTimeout(() => {
        const ethValue = Web3Service.makeEthFromWei(weiValue);
        dispatch(updateBalance(ethValue.times(-1)));
        dispatch({
          type: ACTION_TYPES.SUCCEEDED_TO_OCCUPY_SLOT_MACHINE,
        });
      }, WAIT_TIME_TO_OCCUPY_SLOT_MACHINE);
    } catch (err) {
      logException(err);

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

export function cashOutSlotMachine(slotContract, playerAddress) {
  return async dispatch => {
    try {
      await Web3Service.cashOutSlotMachine(slotContract, playerAddress);
      dispatch({
        type: ACTION_TYPES.UPDATE_BREAK_AWAY_TRY,
        payload: {
          isBreakAway: false,
        },
      });
    } catch (err) {
      logException(err);

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
        const betMoney = playInfo.betSize.times(playInfo.lineNum);
        const diffMoney = ethReward.minus(betMoney);
        const betData = {
          time: moment().format('YY.MM.DD H:mm:ss'),
          bet: `${betMoney.valueOf()} ETH`,
          result: 'success',
          profit: `${diffMoney.valueOf()} ETH`,
        };
        stopSpinFunc(ethReward);
        dispatch({
          type: ACTION_TYPES.SUCCEEDED_TO_PLAY_GAME,
          payload: {
            betData,
            diffMoney,
          },
        });
      })
      .catch(err => {
        console.log('err is ', err);
        logException(err);

        Toast.notie.alert({
          type: 'error',
          text: `There was an error for playing a slot machine. ${err}`,
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

export function setWaitOccupy(waitOccupy) {
  return {
    type: ACTION_TYPES.SET_WAIT_OCCUPY,
    payload: {
      waitOccupy,
    },
  };
}

export function intializePlaySlotState() {
  return {
    type: ACTION_TYPES.INITIALIZE_PLAY_SLOT_STATE,
  };
}

export function updateBetDataAfterStopSpin() {
  return {
    type: ACTION_TYPES.UPDATE_BET_DATA_AFTER_STOP_SPIN,
  };
}
