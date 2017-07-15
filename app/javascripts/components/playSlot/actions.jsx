export const ACTION_TYPES = {
  SET_BET_SIZE: 'play_slot.SET_BET_SIZE',
  SET_LINE_NUM: 'play_slot.SET_LINE_NUM',
  SET_BANK_ROLL: 'play_slot.SET_BANK_ROLL',
  SPIN_START: 'play_slot.SPIN_START',
  SPIN_END: 'play_slot.SPIN_END',
  TOGGLE_EMOTION: 'play_slot.TOGGLE_EMOTION',
};

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

export function spinStart() {
  return {
    type: ACTION_TYPES.SPIN_START,
  };
}

export function spinEnd() {
  return {
    type: ACTION_TYPES.SPIN_END,
  };
}

export function toggleEmotion() {
  return {
    type: ACTION_TYPES.TOGGLE_EMOTION,
  };
}
