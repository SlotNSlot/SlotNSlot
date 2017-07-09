import React from 'react';
import styles from './footer.scss';
import Icon from '../../../icons';

const Footer = () =>
  <div className={styles.footer}>
    <div className={styles.innerContainer}>
      <div className={styles.footerContent}>
        © Slot N Slot. All Rights Reserved <br />
        team@slotnslot.com
      </div>
      <div className={styles.rightBtns}>
        <a href="https://github.com/SlotNSlot/SlotNSlot" target="_blank">
          <Icon className={styles.snsBtn} icon="GITHUB_FOR_FOOTER" />
        </a>
        <a
          className={styles.btnContainer}
          href="https://www.reddit.com/r/ethereum/comments/6m6eu0/slotnslot_make_and_play_slots_on_ethereum_needs/?st=j4wgacux&sh=9bfabdf4"
          target="_blank"
        >
          <Icon className={styles.snsBtn} icon="REDDIT_FOR_FOOTER" />
        </a>
        <a className={styles.btnContainer} href="https://www.hipchat.com/gIUbFZBvh" target="_blank">
          <Icon className={styles.snsBtn} icon="HIPCHAT_FOR_FOOTER" />
        </a>
        <a className={styles.btnContainer} href="https://twitter.com/slotnslot" target="_blank">
          <Icon className={styles.snsBtn} icon="TWITTER_FOR_FOOTER" />
        </a>
      </div>
    </div>
  </div>;
export default Footer;
