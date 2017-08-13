import Raven from 'raven-js';
import { push } from 'react-router-redux';
import EnvChecker from '../helpers/envChecker';
import Web3Service from '../helpers/web3Service';
import Toast from '../helpers/notieHelper';

export const ACTION_TYPES = {
  START_TO_GET_ACCOUNT: 'ROOT.START_TO_GET_ACCOUNT',
  FETCH_ACCOUNT: 'ROOT.FETCH_ACCOUNT',
  FAILED_TO_GET_ACCOUNT: 'ROOT.FAILED_TO_GET_ACCOUNT',
  SET_TOTAL_COIN_BALANCE: 'ROOT.SET_COIN_BALANCE',
  UPDATE_BALANCE: 'ROOT.UPDATE_BALANCE',
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
    Web3Service.getWeb3().eth.getBalance(account, (err, balance) => {
      if (err) {
        console.error(err);
      } else {
        dispatch(setCoinBalance(Web3Service.makeEthFromWei(parseFloat(balance, 10))));
      }
    });
  };
}

export function updateBalance(diffMoney) {
  return {
    type: ACTION_TYPES.UPDATE_BALANCE,
    payload: {
      diffMoney,
    },
  };
}

export function setAccount() {
  return dispatch => {
    if (!Web3Service.getWeb3()) {
      Toast.notie.confirm({
        text: 'You have to set Ethereum Client Configuration. Do you want to move set up page?',
        cancelText: 'Reload',
        submitCallback: () => {
          dispatch(push('/instruction'));
        },
        cancelCallback: () => {
          window.location.reload();
        },
      });
      return;
    }
    dispatch({ type: ACTION_TYPES.START_TO_GET_ACCOUNT });

    Web3Service.getWeb3().eth.getCoinbase((err, coinbase) => {
      if (err || coinbase === null) {
        Toast.notie.confirm({
          text: 'You have some error for connecting Ethereum Network. Do you want to move set up page?',
          cancelText: 'Reload',
          submitCallback: () => {
            dispatch(push('/instruction'));
          },
          cancelCallback: () => {
            window.location.reload();
          },
        });
        dispatch({ type: ACTION_TYPES.FAILED_TO_GET_ACCOUNT });
      } else {
        dispatch({
          type: ACTION_TYPES.FETCH_ACCOUNT,
          payload: {
            account: coinbase,
          },
        });

        if (!EnvChecker.isDev()) {
          Raven.setUserContext({
            account: coinbase,
            provider: Web3Service.getWeb3().currentProvider,
            web3Version: Web3Service.getWeb3().version.api,
          });
        }

        dispatch(refreshBalance(coinbase));
      }
    });
  };
}
