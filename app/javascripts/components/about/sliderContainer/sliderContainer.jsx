import React from 'react';
import styles from './sliderContainer.scss';
import Icon from '../../../icons';

const sliderContainer = () =>
  <div className={styles.sliderContainer}>
    <div className={styles.innerContainer}>
      <div className={styles.leftBlock}>
        <div className={styles.logoTitle}>
          <Icon icon="SLOT_N_SLOT_LOGO_NON_SHADOW" />
        </div>
        <div className={styles.subTitle}>Android Mobile App</div>

        <div className={styles.guide}>Install Now!</div>
        <a
          className={styles.googlePlayLink}
          onClick={() => {
            window.open('https://google.com', '', '');
          }}
        >
          <img src="https://d1qh7kd1bid312.cloudfront.net/about/google-play-download.png" alt="google-play-download" />
        </a>
      </div>
      <div className={styles.rightBlock}>
        <div className={styles.title}>Play from everywhere</div>
        <div className={styles.context}>
          By offering mobile apps, users can enjoy games more easily. <br />
          Create and play slots in the mobile app!
        </div>
      </div>
    </div>
  </div>;
export default sliderContainer;
