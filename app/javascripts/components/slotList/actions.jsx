import { List, fromJS } from 'immutable';
import { logException } from '../../helpers/errorLogger';
import { push } from 'react-router-redux';
import Web3Service from '../../helpers/web3Service';
import Toast from '../../helpers/notieHelper';

export const USER_TYPES = {
  PLAYER: 0,
  MAKER: 1,
  WATCHER: 2,
};

export const ACTION_TYPES = {
  START_TO_GET_ALL_SLOT_MACHINES: 'slot_list.START_TO_GET_ALL_SLOT_MACHINES',
  SUCCEEDED_TO_GET_ALL_SLOT_MACHINES: 'slot_list.SUCCEEDED_TO_GET_ALL_SLOT_MACHINES',
  FAILED_TO_GET_ALL_SLOT_MACHINES: 'slot_list.FAILED_TO_GET_ALL_SLOT_MACHINES',

  START_TO_GET_MY_SLOT_MACHINES: 'slot_list.START_TO_GET_MY_SLOT_MACHINES',
  SUCCEEDED_TO_GET_MY_SLOT_MACHINES: 'slot_list.SUCCEEDED_TO_GET_MY_SLOT_MACHINES',
  FAILED_TO_GET_MY_SLOT_MACHINES: 'slot_list.FAILED_TO_GET_MY_SLOT_MACHINES',
  SUCCEEDED_TO_WATCH_MY_SLOT_MACHINES: 'slot_list.SUCCEEDED_TO_WATCH_MY_SLOT_MACHINES',
  FAILED_TO_WATCH_MY_SLOT_MACHINES: 'slot_list.FAILED_TO_WATCH_MY_SLOT_MACHINES',

  TOGGLE_SORTING_DROPDOWN: 'slot_list.TOGGLE_SORTING_DROPDOWN',
  CHANGE_SORTING_OPTION: 'slot_list.CHANGE_SORTING_OPTION',

  UPDATE_JUST_LEAVED_SLOT_ADDRESS: 'slot_list.UPDATE_JUST_LEAVED_SLOT_ADDRESS',
};

async function getSlotMachineInfo(slotMachineContractAddress, userType, myAccount = null) {
  const contract = Web3Service.getSlotMachineContract(slotMachineContractAddress);
  try {
    const slotInfo = await Web3Service.getSlotMachineInfo(contract, userType, myAccount);
    return {
      contract,
      meta: slotInfo,
    };
  } catch (err) {
    logException(err);
    return null;
  }
}

export function updateJustLeavedSlotAddress(slotMachineContractAddress) {
  return dispatch => {
    dispatch({
      type: ACTION_TYPES.UPDATE_JUST_LEAVED_SLOT_ADDRESS,
      payload: {
        slotMachineContractAddress,
      },
    });
  };
}

export function getMySlotMachines(myAccount) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.START_TO_GET_MY_SLOT_MACHINES,
    });

    try {
      const slotMachineAddressesArray = await Web3Service.getSlotMachinesFromBanker(myAccount);
      const promiseArr = [];
      slotMachineAddressesArray.forEach(slotMachineContractAddress => {
        promiseArr.push(getSlotMachineInfo(slotMachineContractAddress, USER_TYPES.MAKER, myAccount));
      });
      await Promise.all(promiseArr).then(async resultArr => {
        const filteredArr = resultArr.filter(slotContractInfo => {
          return slotContractInfo !== null;
        });
        const slotContracts = fromJS(filteredArr);
        const timerId = await Web3Service.makerPendingWatcher(slotContracts, myAccount);
        dispatch({
          type: ACTION_TYPES.SUCCEEDED_TO_GET_MY_SLOT_MACHINES,
          payload: {
            slotContracts,
            timerId,
          },
        });
      });
    } catch (err) {
      logException(err);

      console.error(err);
      dispatch({
        type: ACTION_TYPES.FAILED_TO_GET_MY_SLOT_MACHINES,
      });
    }
  };
}

export function getAllSlotMachines(myAccount, justLeavedSlotAddress) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.START_TO_GET_ALL_SLOT_MACHINES,
    });
    try {
      const allSlotMachineAddressesArray = await Web3Service.getAllSlotMachineAddressesArray();
      const slotInformationArr = [];

      for (const slotMachineContractAddress of allSlotMachineAddressesArray) {
        if (slotMachineContractAddress !== justLeavedSlotAddress) {
          const slotInformation = await getSlotMachineInfo(slotMachineContractAddress, USER_TYPES.PLAYER, myAccount);
          if (slotInformation && slotInformation.meta) {
            if (slotInformation.meta.isAlreadyOccupiedByMe) {
              console.log(slotInformation.meta.slotName);
              Toast.notie.confirm({
                text: 'Your last game is still alive. Do you want to move to the last game?',
                submitCallback: () => {
                  dispatch(push(`/slot/play/${slotInformation.meta.address}`));
                },
              });
            }
            slotInformationArr.push(slotInformation);
          }
        }
      }
      dispatch(updateJustLeavedSlotAddress(null));
      const slotContracts = fromJS(slotInformationArr);

      dispatch({
        type: ACTION_TYPES.SUCCEEDED_TO_GET_ALL_SLOT_MACHINES,
        payload: {
          slotContracts,
        },
      });
    } catch (err) {
      logException(err);

      console.error(err);
      dispatch({
        type: ACTION_TYPES.FAILED_TO_GET_ALL_SLOT_MACHINES,
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
