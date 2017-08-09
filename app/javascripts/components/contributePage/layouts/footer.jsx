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
        <a className={styles.btnContainer} href="https://t.me/slotnslot_ico" target="_blank">
          <Icon className={styles.snsBtn} icon="TELEGRAM_FOR_FOOTER" />
        </a>
        <a className={styles.btnContainer} href="https://www.facebook.com/slotnslot.eth" target="_blank">
          <Icon className={styles.snsBtn} icon="FACEBOOK_FOR_FOOTER" />
        </a>
        <a className={styles.btnContainer} href="https://github.com/SlotNSlot/SlotNSlot" target="_blank">
          <Icon className={styles.snsBtn} icon="GITHUB_FOR_FOOTER" />
        </a>
        <a className={styles.btnContainer} href="https://www.reddit.com/r/slotnslot" target="_blank">
          <Icon className={styles.snsBtn} icon="REDDIT_FOR_FOOTER" />
        </a>
        <a className={styles.btnContainer} href="https://discord.gg/f97RkQf" target="_blank">
          <Icon className={styles.snsBtn} icon="DISCORD_FOR_FOOTER" />
        </a>
        <a className={styles.btnContainer} href="https://twitter.com/slotnslot" target="_blank">
          <Icon className={styles.snsBtn} icon="TWITTER_FOR_FOOTER" />
        </a>
        <a className={styles.btnContainer} href="https://medium.com/@kkenji1024" target="_blank">
          <Icon className={styles.snsBtn} icon="MEDIUM_FOR_FOOTER" />
        </a>
      </div>
    </div>
  </div>;
export default Footer;
