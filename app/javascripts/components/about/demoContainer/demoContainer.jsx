import React from 'react';
import styles from './demoContainer.scss';
import Icon from '../../../icons';
import { AVAILABLE_ADWORDS_TYPE, handleAdwordsAction } from '../../../helpers/handleAdwordsAction';

const handleWatchDemoClick = () => {
  handleAdwordsAction(AVAILABLE_ADWORDS_TYPE.NORMAL_LINK_CLICK);
  window.open('https://youtu.be/9TtOFJ2InH8', '_blank');
};

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

      <a onClick={handleWatchDemoClick}>
        <div className={styles.videoBox}>
          <Icon icon="PLAY_BUTTON" />
          <img src="https://d1qh7kd1bid312.cloudfront.net/about/macbook.png" alt="demo_image" />
        </div>
      </a>
    </div>
  </div>;
export default DemoContainer;
