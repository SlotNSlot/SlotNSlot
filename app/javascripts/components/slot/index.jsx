import React from 'react';
import { Route } from 'react-router-dom';
import styles from './slot.scss';
import { Header, Footer } from './layouts';
import MakeGame from '../makeGame';
import PlaySlot from '../playSlot';
import Status404 from '../404';

const Slot = ({ match }) =>
  <div className={styles.slotContainer}>
    <Header />
    <Route path={`${match.url}/play`} component={PlaySlot} />
    <Route path={`${match.url}/make`} component={MakeGame} />
    <Route exact path={match.url} component={PlaySlot} />
    <Route component={PlaySlot} />
    <Footer component={Status404} />
  </div>;

export default Slot;
