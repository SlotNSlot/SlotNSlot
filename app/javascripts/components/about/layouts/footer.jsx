import React from 'react';
import ReactGA from 'react-ga';
import styles from './footer.scss';
import Icon from '../../../icons';
// helpers
import { AVAILABLE_ADWORDS_TYPE, handleAdwordsAction } from '../../../helpers/handleAdwordsAction';

const openLinkWithTrack = linkUrl => {
  ReactGA.event({
    category: 'link-click',
    action: 'click-from-Footer',
    label: linkUrl,
  });
  handleAdwordsAction(AVAILABLE_ADWORDS_TYPE.NORMAL_LINK_CLICK);

  window.open(linkUrl, '_blank');
};

const Footer = () =>
  <div className={styles.footer}>
    <div className={styles.innerContainer}>
      <div className={styles.footerContent}>
        © Slot N Slot. All Rights Reserved <br />
        team@slotnslot.com
      </div>
      <div className={styles.rightBtns}>
        <a
          onClick={() => {
            openLinkWithTrack('https://github.com/SlotNSlot/SlotNSlot');
          }}
        >
          <Icon className={styles.snsBtn} icon="GITHUB_FOR_FOOTER" />
        </a>
        <a
          className={styles.btnContainer}
          onClick={() => {
            openLinkWithTrack(
              'https://www.reddit.com/r/ethereum/comments/6m6eu0/slotnslot_make_and_play_slots_on_ethereum_needs/?st=j4wgacux&sh=9bfabdf4',
            );
          }}
        >
          <Icon className={styles.snsBtn} icon="REDDIT_FOR_FOOTER" />
        </a>
        <a
          className={styles.btnContainer}
          onClick={() => {
            openLinkWithTrack('https://discord.gg/f97RkQf');
          }}
        >
          <Icon className={styles.snsBtn} icon="HIPCHAT_FOR_FOOTER" />
        </a>
        <a
          className={styles.btnContainer}
          onClick={() => {
            openLinkWithTrack('https://twitter.com/slotnslot');
          }}
        >
          <Icon className={styles.snsBtn} icon="TWITTER_FOR_FOOTER" />
        </a>
        <a
          className={styles.btnContainer}
          onClick={() => {
            openLinkWithTrack('https://medium.com/@kkenji1024');
          }}
        >
          <Icon className={styles.snsBtn} icon="MEDIUM_FOR_FOOTER" />
        </a>
      </div>
    </div>
  </div>;
export default Footer;
