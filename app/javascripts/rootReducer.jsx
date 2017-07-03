import * as Redux from 'redux';
import { routerReducer } from 'react-router-redux';
import * as RootReducer from './root/reducer';
import * as MakeGameReducer from './components/makeGame/reducer';
import * as AboutLayoutReducer from './components/about/layouts/reducer';

export const initialState = {
  root: RootReducer.initialState,
  makeGame: MakeGameReducer.initialState,
  aboutLayout: AboutLayoutReducer.initialState,
};

export const rootReducer = Redux.combineReducers({
  root: RootReducer.reducer,
  makeGame: MakeGameReducer.reducer,
  aboutLayout: AboutLayoutReducer.reducer,
  router: routerReducer,
});
