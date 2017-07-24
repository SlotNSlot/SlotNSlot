import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Icon from '../../../icons';
import styles from './header.scss';

const Header = ({ rootState, location }) =>
  <div className={styles.header}>
    <div className={styles.headerContainer}>
      <Link to="/" className={styles.logo}>
        <Icon className={styles.logo} icon="SLOT_N_SLOT_LOGO" />
      </Link>
      <div className={styles.leftItems}>
        <NavLink to="/slot/play" className={styles.navItem} activeClassName={styles.navItemActive} location={location}>
          PLAY
        </NavLink>
        <NavLink to="/slot/make" className={styles.navItem} activeClassName={styles.navItemActive} location={location}>
          MAKE
        </NavLink>
      </div>
      <div className={styles.rightItems}>
        <div className={styles.walletStatus}>
          Your balance : {parseFloat(rootState.get('balance'), 10).toFixed(3)} ETH
        </div>
        <div className={styles.buttonWrapper}>
          <button className={styles.accountBtn}>
            Your Account
            <Icon className={styles.triangle} icon="TRIANGLE_DOWN" />
          </button>
        </div>
      </div>
    </div>
  </div>;

export default Header;
