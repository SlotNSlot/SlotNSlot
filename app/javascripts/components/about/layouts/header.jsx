import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import throttle from 'lodash.throttle';
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
              <a className={styles.item} href="https://github.com/SlotNSlot/SlotNSlot" target="_blank">
                GitHub
              </a>
            </li>
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
              <a className={styles.item} href="https://www.hipchat.com/gIUbFZBvh" target="_blank">
                Chat
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  handleScrollEvent() {
    const { dispatch } = this.props;

    const top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    if (parseInt(top, 10) < window.innerHeight) {
      dispatch(reactScrollTop());
    } else {
      dispatch(leaveScrollTop());
    }
  }
}

export default withRouter(connect(mapStateToProps)(Header));
