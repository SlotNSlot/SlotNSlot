import Web3Service from '../../helpers/web3Service';

export const ACTION_TYPES = {
  START_TO_GET_SLOT_MACHINES: 'slot_list.START_TO_GET_SLOT_MACHINES',
  SUCCEEDED_TO_GET_SLOT_MACHINES: 'slot_list.SUCCEEDED_TO_GET_SLOT_MACHINES',
  FAILED_TO_GET_SLOT_MACHINES: 'slot_list.FAILED_TO_GET_SLOT_MACHINES',
  TOGGLE_SORTING_DROPDOWN: 'slot_list.TOGGLE_SORTING_DROPDOWN',
  CHANGE_SORTING_OPTION: 'slot_list.CHANGE_SORTING_OPTION',
};

export function getSlotMachines(account) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.START_TO_GET_SLOT_MACHINES,
    });

    try {
      await Web3Service.getSlotMachineAddressesFromProvider(account);
      dispatch({
        type: ACTION_TYPES.SUCCEEDED_TO_GET_SLOT_MACHINES,
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.FAILED_TO_GET_SLOT_MACHINES,
      });
    }
  };
}

export function handleClickSortingOption(option) {
  return {
    type: ACTION_TYPES.CHANGE_SORTING_OPTION,
    payload: {
      option,
    },
  };
}

export function handleSortDropdownOpen() {
  return {
    type: ACTION_TYPES.TOGGLE_SORTING_DROPDOWN,
  };
}
