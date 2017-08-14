export const ACTION_TYPES = {
  UPDATE_COUNTDOWN: 'CROWDSALE_PAGE.UPDATE_COUNTDOWN',
  UPDATE_CURRENT_ETHER: 'CROWDSALE_PAGE.UPDATE_CURRENT_ETHER',
  AGREE_TERMS_CONDITION: 'CROWDSALE_PAGE.AGREE_TERMS_CONDITION',
  AGREE_LEGAL_RESIDENT: 'CROWDSALE_PAGE.AGREE_LEGAL_RESIDENT',
  AGREED_ALL_CHECKBOX: 'CROWDSALE_PAGE.AGREED_ALL_CHECKBOX',
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

export function toggleAgreeTerms() {
  return {
    type: ACTION_TYPES.AGREE_TERMS_CONDITION,
  };
}

export function toggleLegalResident() {
  return {
    type: ACTION_TYPES.AGREE_LEGAL_RESIDENT,
  };
}

export function setNextModal() {
  return {
    type: ACTION_TYPES.AGREED_ALL_CHECKBOX,
  };
}
