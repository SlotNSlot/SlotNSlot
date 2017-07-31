import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import styles from './slot.scss';
import { Header, Footer } from './layouts';
import MakeGame from '../makeGame';
import PlaySlot from '../playSlot';
import WatchSlot from '../watchSlot';
import MySlotListContainer from '../slotList/mySlotList';
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
      <Route exact path={`${match.url}/play`} component={SlotList} />
      <Route exact path={`${match.url}/play/:slotAddress`} component={PlaySlot} />
      <Route exact path={`${match.url}/make`} component={MySlotListContainer} />
      <Route exact path={`${match.url}/make/:slotAddress`} component={WatchSlot} />
      <Route exact path={`${match.url}/make/step/:step`} component={MakeGame} />
      <Route component={Status404} />
    </Switch>
    <Footer />
  </div>;

export default withRouter(connect(mapStateToProps)(Slot));
