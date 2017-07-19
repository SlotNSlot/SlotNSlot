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
  SUCCEEDED_TO_PLAY_GAME: 'play_slot.SUCCEED_TO_MAKE_GAME',
  FAILED_TO_PLAY_GAME: 'play_slot.FAILED_TO_MAKE_GAME',
};

async function getSlotMachineInfo(slotMachineContract) {
  const payload = {};
  await new Promise((resolve, reject) => {
    slotMachineContract.mAvailable((err, mAvailable) => {
      if (err) {
        reject(err);
      } else {
        payload.mAvailable = mAvailable;
        if (!mAvailable) reject('This slot is not avaliable!');
        resolve(mAvailable);
      }
    });
  });
  await new Promise((resolve, reject) => {
    slotMachineContract.mBankrupt((err, mBankrupt) => {
      if (err) {
        reject(err);
      } else {
        payload.mBankrupt = mBankrupt;
        if (mBankrupt) reject('This slot is bankrupt!');
        resolve(mBankrupt);
      }
    });
  });
  await new Promise((resolve, reject) => {
    slotMachineContract.mMaxBet((err, mMaxBet) => {
      if (err) {
        reject(err);
      } else {
        payload.maxBet = Web3Service.getEthFromWei(parseInt(mMaxBet.valueOf(), 10));
        resolve(mMaxBet);
      }
    });
  });
  await new Promise((resolve, reject) => {
    slotMachineContract.mMinBet((err, mMinBet) => {
      if (err) {
        reject(err);
      } else {
        payload.minBet = Web3Service.getEthFromWei(parseInt(mMinBet.valueOf(), 10));
        resolve(mMinBet);
      }
    });
  });
  await new Promise((resolve, reject) => {
    slotMachineContract.providerBalance((err, providerBalance) => {
      if (err) {
        reject(err);
      } else {
        payload.bankRoll = Web3Service.getEthFromWei(parseInt(providerBalance.valueOf(), 10));
        resolve(providerBalance);
      }
    });
  });
  return payload;
}

export function getSlotMachine(slotAddress) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.START_TO_GET_SLOT_MACHINE,
    });

    try {
      const slotMachineContract = Web3Service.getSlotMachineContract(slotAddress);
      await getSlotMachineInfo(slotMachineContract)
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
        });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.FAILED_TO_GET_SLOT_MACHINE,
      });
    }
  };
}

export function requestToPlayGame(playInfo) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.START_TO_PLAY_GAME,
    });
    try {
      const transaction = await Web3Service.playSlotMachine(playInfo);
      dispatch({
        type: ACTION_TYPES.SUCCEEDED_TO_PLAY_GAME,
        payload: transaction,
      });
    } catch (err) {
      Toast.notie.alert({
        type: 'error',
        text: 'There was an error for playing a slot machine',
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
