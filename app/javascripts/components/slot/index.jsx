import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import styles from './slot.scss';
import { Header } from './layouts';
import MakeGame from '../makeGame';
import PlaySlot from '../playSlot';
import SlotList from '../slotList';
import Status404 from '../404';

function mapStateToProps(appState) {
  return {
    rootState: appState.root,
  };
}

const Slot = ({ match, location, rootState }) =>
  <div className={styles.slotContainer}>
    <Header rootState={rootState} location={location} />
    <Switch>
      <Route exact path={`${match.url}/play`} component={PlaySlot} />
      <Route path={`${match.url}/make/:step`} component={MakeGame} />
      <Route exact path={match.url} component={SlotList} />
      <Route component={Status404} />
    </Switch>
  </div>;

export default withRouter(connect(mapStateToProps)(Slot));
