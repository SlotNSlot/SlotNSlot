import { List, fromJS } from 'immutable';
import Web3Service from '../../helpers/web3Service';

export const USER_TYPES = {
  PLAYER: 0,
  MAKER: 1,
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
};

async function getSlotMachines(account, userType, myAccount = null) {
  const bigNumberOfTotalNumOfSlotMachine = await Web3Service.getNumOfSlotMachine(account);
  const totalNumOfSlotMachine = parseInt(bigNumberOfTotalNumOfSlotMachine.valueOf(), 10);

  if (totalNumOfSlotMachine === 0) {
    return List();
  }

  const slotAddresses = [];
  const slotMachineContracts = [];

  for (let i = totalNumOfSlotMachine - 1; i >= 0; i -= 1) {
    const slotAddress = await Web3Service.getSlotMachineAddressFromBanker(account, i);
    slotAddresses.push(slotAddress);
  }

  for (let i = 0; i < slotAddresses.length; i += 1) {
    const contract = Web3Service.getSlotMachineContract(slotAddresses[i]);
    try {
      const slotInfo = await Web3Service.getSlotMachineInfo(contract, userType, myAccount);
      slotMachineContracts.push({
        contract,
        meta: slotInfo,
      });
    } catch (err) {
      // console.log(err);
    }
  }
  return fromJS(slotMachineContracts);
}

export function getMySlotMachines(account) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.START_TO_GET_MY_SLOT_MACHINES,
    });

    try {
      const slotMachineContracts = await getSlotMachines(account, USER_TYPES.MAKER);
      dispatch({
        type: ACTION_TYPES.SUCCEEDED_TO_GET_MY_SLOT_MACHINES,
        payload: {
          slotContracts: slotMachineContracts,
        },
      });
      Web3Service.makerPendingWatcher(slotMachineContracts, account);
    } catch (err) {
      console.error(err);
      dispatch({
        type: ACTION_TYPES.FAILED_TO_GET_MY_SLOT_MACHINES,
      });
    }
  };
}

export function getAllSlotMachines(myAccount) {
  return async dispatch => {
    dispatch({
      type: ACTION_TYPES.START_TO_GET_ALL_SLOT_MACHINES,
    });

    const bankerAddresses = [];
    const bigNumOfBankers = await Web3Service.getTheNumberOfBankers();
    const numbOfBankers = parseInt(bigNumOfBankers.valueOf(), 10);

    for (let i = numbOfBankers - 1; i >= 0; i -= 1) {
      const address = await Web3Service.getBankerAddress(i);
      bankerAddresses.push(address);
    }

    const promiseArr = [];
    bankerAddresses.forEach(bankerAddress => {
      promiseArr.push(getSlotMachines(bankerAddress, USER_TYPES.PLAYER, myAccount));
    });

    await Promise.all(promiseArr)
      .then(resultArr => {
        const filteredArray = resultArr.filter(contractList => {
          return contractList.size > 0;
        });

        const slotContracts = List(filteredArray).flatten(true);

        dispatch({
          type: ACTION_TYPES.SUCCEEDED_TO_GET_ALL_SLOT_MACHINES,
          payload: {
            slotContracts,
          },
        });
      })
      .catch(error => {
        if (error) {
          console.error(error);
        }
        dispatch({
          type: ACTION_TYPES.FAILED_TO_GET_ALL_SLOT_MACHINES,
        });
      });
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
