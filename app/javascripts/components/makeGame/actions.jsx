import Web3Service from '../../helpers/web3Service';

export const ACTION_TYPES = {
  SELECT_HIT_RATIO: 'make_game.SELECT_HIT_RATIO',
  SET_MAX_PRIZE: 'make_game.SET_MAX_PRIZE',
  CHANGE_TOTAL_STAKE: 'make_game.CHANGE_TOTAL_STAKE',
  SET_BET_MIN_VALUE: 'make_game.SET_BET_MIN_VALUE',
  SET_BET_MAX_VALUE: 'make_game.SET_BET_MAX_VALUE',
  SET_SLOT_NAME: 'make_game.SET_SLOT_NAME',

  START_TO_MAKE_GAME: 'make_game.START_TO_MAKE_GAME',
  SUCCEED_TO_MAKE_GAME: 'make_game.SUCCEED_TO_MAKE_GAME',
  FAILED_TO_MAKE_GAME: 'make_game.FAILED_TO_MAKE_GAME',
};

export function requestToMakeGame(account) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.START_TO_MAKE_GAME,
    });
    try {
      const transaction = await Web3Service.createSlotMachine(account);
      dispatch({
        type: ACTION_TYPES.SUCCEED_TO_MAKE_GAME,
        payload: transaction,
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.FAILED_TO_MAKE_GAME,
      });
    }
  };
}

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
