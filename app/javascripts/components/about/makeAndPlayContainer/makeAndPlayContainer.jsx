import React from 'react';
import ReactGA from 'react-ga';
import UAParser from 'ua-parser-js';
import styles from './makeAndPlayContainer.scss';
import Icon from '../../../icons';
import { AVAILABLE_ADWORDS_TYPE, handleAdwordsAction } from '../../../helpers/handleAdwordsAction';

function trackWordsOnly() {
  ReactGA.event({
    category: 'link-click',
    action: 'click-from-MakeAndPlayContainer',
    label: '/slot/play',
  });
  handleAdwordsAction(AVAILABLE_ADWORDS_TYPE.NORMAL_LINK_CLICK);
}

function trackAndOpenLink(url) {
  ReactGA.event({
    category: 'link-click',
    action: 'click-from-MakeAndPlayContainer',
    label: url,
  });

  if (typeof navigator !== undefined && url === 'http://beta.slotnslot.com/slot/play/') {
    const parser = new UAParser(navigator.userAgent);
    const deviceInformation = parser.getDevice();

    if (deviceInformation.type === 'mobile') {
      alert('SlotNSlot Web client is playable only on Desktop, You can download and play SlotNSlot Mobile App Soon!');
      return;
    }
  }

  handleAdwordsAction(AVAILABLE_ADWORDS_TYPE.NORMAL_LINK_CLICK);
  window.open(url, '_blank');
}

function trackAction(url) {
  ReactGA.event({
    category: 'link-click',
    action: 'click-from-MakeAndPlayContainer',
    label: url,
  });

  handleAdwordsAction(AVAILABLE_ADWORDS_TYPE.NORMAL_LINK_CLICK);
}

const handleWatchDemoClick = () => {
  trackAction('https://youtu.be/9TtOFJ2InH8');
  window.open('https://youtu.be/9TtOFJ2InH8', '_blank');
};

const MakeAndPlayContainer = () =>
  <div className={styles.makeAndPlayContainer}>
    <div className={styles.innerContainer}>
      <div className={styles.makeAndPlayTitle}>
        Tired of just <span>PLAY</span>ing? Now <span>MAKE</span> your own with SlotNSlot !
      </div>
      <div className={styles.betaBtnWrapper}>
        <a onClick={() => trackAndOpenLink('http://beta.slotnslot.com/slot/play/')} className={styles.playBetaBtn}>
          Play Beta
        </a>
        <a onClick={handleWatchDemoClick} className={styles.watchDemoBtn}>
          <Icon className={styles.triangle} icon="TRIANGLE_RIGHT" />
          Watch Demo
        </a>
      </div>
      <div className={styles.makeAndPlayContext}>
        <img src="https://d1qh7kd1bid312.cloudfront.net/about/Browser_content.png" alt="browser" />
        <div className={`${styles.bubble} ${styles.left}`}>
          <Icon className={styles.bubbleImage} icon="BUBBLE_LEFT" />
          <div className={styles.bubbleContext}>
            <div className={styles.bubbleTitle}>Make Slot</div>
            <div className={styles.bubbleText}>
              -Easiest way in the world to make your slots!<br />-Mine ETH through slots!<br />-You have control over
              your slot settings!
            </div>
          </div>
        </div>
        <div className={`${styles.bubble} ${styles.right}`}>
          <Icon className={styles.bubbleImage} icon="BUBBLE_RIGHT" />
          <div className={styles.bubbleContext}>
            <div className={styles.bubbleTitle}>Play Slot</div>
            <div className={styles.bubbleText}>
              -Ruin slots with the lowest bankrolls!<br />-Find slots with highest odds!<br />-Build your own strategy
              to maximize prize!
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
export default MakeAndPlayContainer;
