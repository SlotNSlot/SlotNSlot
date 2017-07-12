import * as Redux from 'redux';
import { routerReducer } from 'react-router-redux';
import * as RootReducer from './root/reducer';
import * as MakeGameReducer from './components/makeGame/reducer';
import * as AboutLayoutReducer from './components/about/layouts/reducer';
import * as AboutCrowdSaleReducer from './components/about/crowdSaleContainer/reducer';

export const initialState = {
  root: RootReducer.initialState,
  makeGame: MakeGameReducer.initialState,
  aboutLayout: AboutLayoutReducer.initialState,
  aboutCrowdSale: AboutCrowdSaleReducer.initialState,
};

export const rootReducer = Redux.combineReducers({
  root: RootReducer.reducer,
  makeGame: MakeGameReducer.reducer,
  aboutLayout: AboutLayoutReducer.reducer,
  aboutCrowdSale: AboutCrowdSaleReducer.reducer,
  router: routerReducer,
});
