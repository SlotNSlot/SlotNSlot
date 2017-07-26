import React from 'react';
import styles from './demoContainer.scss';
import Icon from '../../../icons';

const DemoContainer = () =>
  <div className={styles.demoContainer}>
    <div className={styles.innerContainer}>
      <div className={styles.leftInfo}>
        <div className={styles.title}>
          SlotNSlot Demo <br /> Video on Rinkeby
        </div>
        <div className={styles.text}>
          Watch a game session being MADE on Android App, and PLAYED on Web browser, with actual TXs being tracked on
          Etherscan.io !
        </div>
      </div>

      <a href="https://youtu.be/wNYFsxINSa8" target="_blank">
        <div className={styles.videoBox}>
          <Icon icon="PLAY_BUTTON" />
          <img src="https://d1qh7kd1bid312.cloudfront.net/about/macbook.png" alt="demo_image" />
        </div>
      </a>
    </div>
  </div>;
export default DemoContainer;
