import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './header.scss';

const Header = ({ rootState }) =>
  <div className={styles.header}>
    <h1 className={styles.title}> SLOT & SLOT </h1>
    <NavLink exact to="/slot/play" className={styles.item} activeClassName="active">
      PLAY
    </NavLink>
    <NavLink exact to="/slot/make" className={styles.item} activeClassName="active">
      MAKE
    </NavLink>
    <div className={styles.walletStatus}>
      {' '}Your Balance : {rootState.get('balance')} ETH
    </div>
    <button className={styles.accountBtn}>Your Account</button>
  </div>;

export default Header;
