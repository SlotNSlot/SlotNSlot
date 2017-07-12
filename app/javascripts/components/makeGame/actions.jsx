export const ACTION_TYPES = {
  SELECT_HIT_RATIO: 'make_game.SELECT_HIT_RATIO',
  SET_MAX_PRIZE: 'make_game.SET_MAX_PRIZE',
  CHANGE_TOTAL_STAKE: 'make_game.CHANGE_TOTAL_STAKE',
  SET_BET_MIN_VALUE: 'make_game.SET_BET_MIN_VALUE',
  SET_BET_MAX_VALUE: 'make_game.SET_BET_MAX_VALUE',
  SET_SLOT_NAME: 'make_game.SET_SLOT_NAME',
};

export function selectHitRation(hitRatio) {
  return {
    type: ACTION_TYPES.SELECT_HIT_RATIO,
    payload: {
      hitRatio,
    },
  };
}

export function handleTotalStakeChange(totalStake) {
  return {
    type: ACTION_TYPES.CHANGE_TOTAL_STAKE,
    payload: {
      totalStake,
    },
  };
}

export function setMaxPrize(maxPrize) {
  return {
    type: ACTION_TYPES.SET_MAX_PRIZE,
    payload: {
      maxPrize,
    },
  };
}

export function setBetMinValue(value) {
  return {
    type: ACTION_TYPES.SET_BET_MIN_VALUE,
    payload: {
      value,
    },
  };
}

export function setBetMaxValue(value) {
  return {
    type: ACTION_TYPES.SET_BET_MAX_VALUE,
    payload: {
      value,
    },
  };
}

export function setSlotName(slotname) {
  return {
    type: ACTION_TYPES.SET_SLOT_NAME,
    payload: {
      slotname,
    },
  };
}
