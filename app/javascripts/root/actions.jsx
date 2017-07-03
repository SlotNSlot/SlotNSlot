import Web3Service from '../helpers/web3Service';

export const ACTION_TYPES = {
  START_TO_GET_ACCOUNT: 'ROOT.START_TO_GET_ACCOUNT',
  FETCH_ACCOUNT: 'ROOT.FETCH_ACCOUNT',
  FAILED_TO_GET_ACCOUNT: 'ROOT.FAILED_TO_GET_ACCOUNT',
  SET_TOTAL_COIN_BALANCE: 'ROOT.SET_COIN_BALANCE',
};

export function setCoinBalance(balance) {
  return {
    type: ACTION_TYPES.SET_TOTAL_COIN_BALANCE,
    payload: {
      balance,
    },
  };
}

export function refreshBalance(account) {
  return dispatch => {
    Web3Service.getMetaCoinContract()
      .deployed()
      .then(instance => {
        return instance.getBalance.call(account, { from: account });
      })
      .then(value => {
        dispatch(setCoinBalance(value.valueOf()));
      })
      .catch(e => {
        console.error(e);
      });
  };
}

export function setAccount() {
  return dispatch => {
    dispatch({ type: ACTION_TYPES.START_TO_GET_ACCOUNT });

    Web3Service.getWeb3().eth.getAccounts((err, accs) => {
      if (err) {
        dispatch({ type: ACTION_TYPES.FAILED_TO_GET_ACCOUNT });
      } else {
        if (accs.length === 0) {
          dispatch({ type: ACTION_TYPES.FAILED_TO_GET_ACCOUNT });
          console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
          return;
        }

        dispatch({
          type: ACTION_TYPES.FETCH_ACCOUNT,
          payload: {
            accounts: accs,
            account: accs[0],
          },
        });
        dispatch(refreshBalance(accs[0]));
      }
    });
  };
}
