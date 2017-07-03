import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import ReactGA from 'react-ga';
// redux stuff
import { store, getHistoryObject } from './store';
import Root from './root';

const history = getHistoryObject();

history.listen(location => {
  ReactGA.set({ page: location.pathname + location.search });
  ReactGA.pageview(location.pathname + location.search);
});

const App = () =>
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Root />
    </ConnectedRouter>
  </Provider>;

ReactGA.initialize('UA-101869784-1', {
  debug: true,
  titleCase: false,
});
ReactGA.set({ page: window.location.pathname + window.location.search });
ReactGA.pageview(window.location.pathname + window.location.search);

// React Rendering
ReactDom.render(<App />, document.getElementById('ether-app'));
