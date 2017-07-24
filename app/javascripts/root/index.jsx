import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// components
import UpdateBlocker from './updateBlocker';
import About from '../components/about';
import Slot from '../components/slot';
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
    const { dispatch } = this.props;
    dispatch(setAccount());
  }

  render() {
    const { location } = this.props;

    return (
      <div>
        <UpdateBlocker location={location}>
          <Switch>
            <Route path="/slot" component={Slot} />
            <Route component={About} />
          </Switch>
        </UpdateBlocker>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Root));
