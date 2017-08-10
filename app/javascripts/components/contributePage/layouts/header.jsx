import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';

// helpers
import { AVAILABLE_ADWORDS_TYPE, handleAdwordsAction } from '../../../helpers/handleAdwordsAction';
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
                onClick={() => {
                  this.openLinkWithTrack('https://github.com/SlotNSlot/whitepaper/blob/master/whitepaper.md');
                }}
              >
                White Paper
              </a>
            </li>
            <li className={styles.rightNavItem}>
              <a
                className={styles.item}
                onClick={() => {
                  this.openLinkWithTrack('https://github.com/SlotNSlot/SlotNSlot');
                }}
              >
                GitHub
              </a>
            </li>
            <li className={styles.rightNavItem}>
              <a
                className={styles.item}
                onClick={() => {
                  this.openLinkWithTrack('https://discord.gg/f97RkQf');
                }}
              >
                Chat
              </a>
            </li>
            <li className={styles.rightNavItem}>
              <a
                className={styles.item}
                onClick={() => {
                  this.openLinkWithTrack('https://medium.com/@kkenji1024');
                }}
              >
                Blog
              </a>
            </li>
            {/* <li className={`${styles.rightNavItem} ${styles.prototypeLink}`}>
              <Link
                className={styles.item}
                onClick={() => {
                  this.trackWordsOnly();
                }}
                to="/slot/play"
              >
                Prototype
              </Link>
            </li> */}
            <li className={styles.rightNavItem}>
              <Link
                onClick={() => {
                  this.trackWordsOnly();
                }}
                className={styles.crowdsaleBtn}
                to="/contribute"
              >
                Contribution
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  trackWordsOnly() {
    ReactGA.event({
      category: 'link-click',
      action: 'click-from-Header',
      label: '/contribute',
    });
    handleAdwordsAction(AVAILABLE_ADWORDS_TYPE.NORMAL_LINK_CLICK);
  }

  openLinkWithTrack(linkUrl) {
    ReactGA.event({
      category: 'link-click',
      action: 'click-from-Header',
      label: linkUrl,
    });
    handleAdwordsAction(AVAILABLE_ADWORDS_TYPE.NORMAL_LINK_CLICK);
    window.open(linkUrl, '_blank');
  }
}

export default withRouter(connect(mapStateToProps)(Header));
