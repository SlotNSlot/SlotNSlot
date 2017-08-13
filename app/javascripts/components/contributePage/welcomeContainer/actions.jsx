export const ACTION_TYPES = {
  UPDATE_COUNTDOWN: 'CROWDSALE_PAGE.UPDATE_COUNTDOWN',
  UPDATE_CURRENT_ETHER: 'CROWDSALE_PAGE.UPDATE_CURRENT_ETHER',
};

export function updateCountdown() {
  return {
    type: ACTION_TYPES.UPDATE_COUNTDOWN,
  };
}

export function updateCurrentEther(newEther) {
  return {
    type: ACTION_TYPES.UPDATE_CURRENT_ETHER,
    payload: {
      currentEther: newEther,
    },
  };
}
