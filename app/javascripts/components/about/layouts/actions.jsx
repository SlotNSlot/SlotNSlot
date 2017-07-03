export const ACTION_TYPES = {
  REACH_SCROLL_TOP: 'ABOUT_LAYOUT.REACH_SCROLL_TOP',
  LEAVE_SCROLL_TOP: 'ABOUT_LAYOUT.LEAVE_SCROLL_TOP',
};

export function reactScrollTop() {
  return {
    type: ACTION_TYPES.REACH_SCROLL_TOP,
  };
}

export function leaveScrollTop() {
  return {
    type: ACTION_TYPES.LEAVE_SCROLL_TOP,
  };
}
