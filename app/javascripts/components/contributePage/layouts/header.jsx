import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// components
import Icon from '../../../icons';
// styles
import styles from './header.scss';

function mapStateToProps(appState) {
  return {
    aboutLayout: appState.aboutLayout,
  };
}

class Header extends React.PureComponent {
  render() {
    const { aboutLayout } = this.props;

    return (
      <div className={styles.header}>
        <div className={styles.navbarContainer}>
          <Link to="/" className={styles.item}>
            <Icon className={styles.logo} icon="SLOT_N_SLOT_LOGO" />
          </Link>
          <ul className={styles.rightNavItemsWrapper}>
            <li className={styles.rightNavItem}>
              <a
                className={styles.item}
                href="https://github.com/SlotNSlot/whitepaper/blob/master/whitepaper.md"
                target="_blank"
              >
                White Paper
              </a>
            </li>
            <li className={styles.rightNavItem}>
              <a className={styles.item} href="https://github.com/SlotNSlot/SlotNSlot" target="_blank">
                GitHub
              </a>
            </li>
            <li className={styles.rightNavItem}>
              <a className={styles.item} href="https://discord.gg/f97RkQf" target="_blank">
                Chat
              </a>
            </li>
            <li className={styles.rightNavItem}>
              <a className={styles.item} href="https://medium.com/@kkenji1024" target="_blank">
                Blog
              </a>
            </li>
            <li className={styles.rightNavItem}>
              <Link className={styles.crowdsaleBtn} to="/contribute">
                Contribution
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Header));
