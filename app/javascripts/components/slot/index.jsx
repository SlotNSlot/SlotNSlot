import React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import styles from './slot.scss';
import { Header, Footer } from './layouts';
import MakeGame from '../makeGame';
import PlaySlot from '../playSlot';
import Status404 from '../404';

function mapStateToProps(appState) {
  return {
    rootState: appState.root,
  };
}

const Slot = ({ match, rootState }) =>
  <div className={styles.slotContainer}>
    <Header rootState={rootState} />
    <Route path={`${match.url}/play`} component={PlaySlot} />
    <Route path={`${match.url}/make`} component={MakeGame} />
    <Route exact path={match.url} component={PlaySlot} />
    <Route component={PlaySlot} />
    <Footer component={Status404} />
  </div>;

export default withRouter(connect(mapStateToProps)(Slot));
