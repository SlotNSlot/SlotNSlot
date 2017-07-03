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
        <a
          className={styles.btnContainer}
          onClick={() => {
            window.open('https://github.com', '', '');
          }}
        >
          <Icon className={styles.snsBtn} icon="GITHUB_FOR_FOOTER" />
        </a>
        <a
          className={styles.btnContainer}
          onClick={() => {
            window.open('https://reddit.com', '', '');
          }}
        >
          <Icon className={styles.snsBtn} icon="REDDIT_FOR_FOOTER" />
        </a>
        <a
          className={styles.btnContainer}
          onClick={() => {
            window.open('https://slack.com', '', '');
          }}
        >
          <Icon className={styles.snsBtn} icon="SLACK_FOR_FOOTER" />
        </a>
      </div>
    </div>
  </div>;
export default Footer;
