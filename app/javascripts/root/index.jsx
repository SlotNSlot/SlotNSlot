import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// components
import AdWords from '../helpers/adwords';
import UpdateBlocker from './updateBlocker';
import About from '../components/about';
import Slot from '../components/slot';
import ContributePage from '../components/contributePage';
import Readme from '../components/readme';
// actions
import { setAccount } from './actions';
// styles
import './root.scss';
import 'slick-carousel/slick/slick.css';

function mapStateToProps(appState) {
  return {
    root: appState.root,
  };
}

class Root extends React.PureComponent {
  componentDidMount() {
    const { dispatch, match } = this.props;

    if (!(match.path === '/' && match.isExact) && !(match.path === '/contribute' && match.isExact)) {
      dispatch(setAccount());
    }
  }

  render() {
    const { location } = this.props;

    return (
      <div>
        <AdWords />
        <UpdateBlocker location={location}>
          <Switch>
            <Route path="/slot" component={Slot} />
            <Route path="/contribute" component={ContributePage} />
            <Route path="/instruction" component={Readme} />
            <Route component={About} />
          </Switch>
        </UpdateBlocker>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Root));
