import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
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
  middleWare = applyMiddleware(thunk, router, logger);
} else {
  middleWare = applyMiddleware(thunk, router);
}

export const store = createStore(rootReducer, middleWare);
