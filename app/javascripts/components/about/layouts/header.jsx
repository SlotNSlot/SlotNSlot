import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import throttle from 'lodash.throttle';
import ReactGA from 'react-ga';
// helpers
import { AVAILABLE_ADWORDS_TYPE, handleAdwordsAction } from '../../../helpers/handleAdwordsAction';
// actions
import { reactScrollTop, leaveScrollTop } from './actions';
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
  constructor(props) {
    super(props);

    this.handleScrollEvent = this.handleScrollEvent.bind(this);
    this.handleScroll = throttle(this.handleScrollEvent, 100);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.handleScrollEvent();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { aboutLayout } = this.props;

    return (
      <div
        style={{
          backgroundColor: aboutLayout.get('isTop') ? 'transparent' : '#222135',
        }}
        className={styles.header}
      >
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

  handleScrollEvent() {
    const { dispatch } = this.props;

    const top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    if (parseInt(top, 10) < 768) {
      dispatch(reactScrollTop());
    } else {
      dispatch(leaveScrollTop());
    }
  }
}

export default withRouter(connect(mapStateToProps)(Header));
