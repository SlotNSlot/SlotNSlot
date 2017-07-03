export const ACTION_TYPES = {
  START_TO_POST_FORM: 'make_game.START_TO_POST_FORM',
  HANDLE_INPUT_CHANGE: 'make_game.HANDLE_INPUT_CHANGE',
  SUCCEEDED_TO_POST_FORM: 'make_game.SUCCEEDED_TO_POST_FORM',
  ERROR_OCCURRED: 'make_game.ERROR_OCCURRED',
};

export function handleSubmit(params) {
  const { slotName, minimumValue, playerChance, maximumValue, deposit } = params;
  return dispatch => {
    // START validation part
    let valid = true;
    const submitParams = {
      type: ACTION_TYPES.ERROR_OCCURRED,
      payload: {
        slotNameError: '',
        playerChanceError: '',
        minimumValueError: '',
        maximumValueError: '',
        depositError: '',
      },
    };

    // XSS filtering
    slotName.replace(/</g, '&lt;').replace(/>/g, 'gt;');
    if (slotName === null || slotName.length <= 2) {
      valid = false;
      submitParams.payload.slotNameError = 'slotName length has to be larger than 2';
    }

    const compareValidate = (paramKey, compareValue, comparison) => {
      const param = params[paramKey];
      if (comparison === 'larger') {
        if (param === null || param <= compareValue) {
          valid = false;
          submitParams.payload[`${paramKey}Error`] = `${paramKey} has to be larger than ${compareValue}`;
        }
      } else if (comparison === 'ste') {
        // ste means smaller than or equal to
        if (param === null || param > compareValue) {
          valid = false;
          submitParams.payload[`${paramKey}Error`] = `${paramKey} has to be smaller than or equal to ${compareValue}`;
        }
      }
    };
    compareValidate('playerChance', 0, 'larger');
    compareValidate('minimumValue', 0, 'larger');
    compareValidate('maximumValue', 0, 'larger');
    compareValidate('deposit', 0, 'larger');

    compareValidate('playerChance', 100, 'ste');
    compareValidate('minimumValue', maximumValue, 'ste');
    compareValidate('maximumValue', deposit, 'ste');

    // send ERROR_OCCURRED Action.
    dispatch(submitParams);
    if (!valid) {
      return;
    }
    // END Validation part

    dispatch({
      type: ACTION_TYPES.START_TO_POST_FORM,
    });

    dispatch({
      type: ACTION_TYPES.SUCCEEDED_TO_POST_FORM,
      payload: {
        slotName,
        minimumValue,
        playerChance,
        maximumValue,
        deposit,
      },
    });
  };
}

export function handleInputChange(type, value) {
  return {
    type: ACTION_TYPES.HANDLE_INPUT_CHANGE,
    payload: {
      type,
      value,
    },
  };
}
