export const ACTION_TYPES = {
  SELECT_HIT_RATIO: 'make_game.SELECT_HIT_RATIO',
  CHANGE_TOTAL_STAKE: 'make_game.CHANGE_TOTAL_STAKE',
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
