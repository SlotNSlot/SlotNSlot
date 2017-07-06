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
          onClick={() => {
            alert('The Reddit will be ready soon!');
          }}
        >
          <Icon className={styles.snsBtn} icon="REDDIT_FOR_FOOTER" />
        </a>
        <a
          className={styles.btnContainer}
          href="https://slotnslot.hipchat.com/invite/724322/12a777b2ffc3582ba011d9c656f0e7b0?utm_campaign=company_room_link"
          target="_blank"
        >
          <Icon className={styles.snsBtn} icon="HIPCHAT_FOR_FOOTER" />
        </a>
        <a className={styles.btnContainer} href="https://twitter.com/slotnslot" target="_blank">
          <Icon className={styles.snsBtn} icon="TWITTER_FOR_FOOTER" />
        </a>
      </div>
    </div>
  </div>;
export default Footer;
