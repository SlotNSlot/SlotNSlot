export const ACTION_TYPES = {
  SELECT_HIT_RATIO: 'make_game.SELECT_HIT_RATIO',
};

export function selectHitRation(hitRatio) {
  return {
    type: ACTION_TYPES.SELECT_HIT_RATIO,
    payload: {
      hitRatio,
    },
  };
}
