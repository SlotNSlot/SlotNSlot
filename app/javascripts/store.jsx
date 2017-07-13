import { createStore, applyMiddleware } from 'redux';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import createHashHistory from 'history/createHashHistory';
// reducers
import { rootReducer } from './rootReducer';
// helpers
import EnvChecker from './helpers/envChecker';

let history = null;

export function getHistoryObject() {
  if (history) {
    return history;
  }
  if (EnvChecker.isDev()) {
    history = createHashHistory();
  } else {
    history = createBrowserHistory();
  }
  return history;
}

const router = routerMiddleware(getHistoryObject());

let middleWare;
if (EnvChecker.isDev()) {
  const logger = createLogger({
    stateTransformer: state => {
      const newState = {};

      for (var i of Object.keys(state)) {
        if (Immutable.Iterable.isIterable(state[i])) {
          newState[i] = state[i].toJS();
        } else {
          newState[i] = state[i];
        }
      }

      return newState;
    },
  });
  middleWare = applyMiddleware(thunk, router, logger);
} else {
  middleWare = applyMiddleware(thunk, router);
}

export const store = createStore(rootReducer, middleWare);
