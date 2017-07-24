export const ACTION_TYPES = {
  UPDATE_COUNTDOWN: 'ABOUT_CROWDSALE.UPDATE_COUNTDOWN',
};

export function updateCountdown() {
  return {
    type: ACTION_TYPES.UPDATE_COUNTDOWN,
  };
}
