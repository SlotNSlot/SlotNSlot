import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import ReactGA from 'react-ga';
import Raven from 'raven-js';
import Web3Service from './helpers/web3Service';
import EnvChecker from './helpers/envChecker';
// Redux
import { store, getHistoryObject } from './store';
import Root from './root';
// Bootstrap styles
import 'bootstrap/dist/css/bootstrap.css';

const RAVEN_KEY = 'https://1c0693f3ef3e4aa5bcc6895c3848b2e4@sentry.io/190512';
const history = getHistoryObject();

history.listen(location => {
  if (!EnvChecker.isDev()) {
    ReactGA.set({ page: location.pathname + location.search });
    ReactGA.pageview(location.pathname + location.search);
  }
});

const App = () =>
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Root />
    </ConnectedRouter>
  </Provider>;

if (!EnvChecker.isDev()) {
  ReactGA.initialize('UA-101869784-1', {
    debug: true,
    titleCase: false,
  });
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);
  Raven.config(RAVEN_KEY).install();
}

Web3Service.initializeStorageContract()
  .then(() => {
    ReactDom.render(<App />, document.getElementById('ether-app'));
  })
  .catch(err => {
    console.log("Couldn't initialize the SlotStorage contract", err);
    ReactDom.render(<App />, document.getElementById('ether-app'));
  });
