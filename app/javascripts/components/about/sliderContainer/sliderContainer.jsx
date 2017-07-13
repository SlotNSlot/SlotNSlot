import React from 'react';
import Icon from '../../../icons';
import styles from './sliderContainer.scss';

const sliderContainer = () =>
  <div className={styles.sliderContainer}>
    <div className={styles.innerContainer}>
      <div className={styles.leftBlock}>
        <div className={styles.logoTitle}>
          <Icon icon="SLOT_N_SLOT_LOGO_NON_SHADOW" />
        </div>
        <div className={styles.subTitle}>It's also on Mobile</div>
        <a
          className={styles.googlePlayLink}
          onClick={() => {
            alert('SlotNSlot application will be available soon!');
          }}
        >
          <img src="https://d1qh7kd1bid312.cloudfront.net/about/google-play-download.png" alt="google-play-download" />
        </a>
      </div>
      <div className={styles.rightBlock}>
        <div className={styles.title}>Play from everywhere</div>
        <div className={styles.context}>
          With mobile support, you can enjoy SlotNSlot anywhere. <br />
          Make&Play both works perfectly same as Web.
        </div>
      </div>
    </div>
  </div>;
export default sliderContainer;
