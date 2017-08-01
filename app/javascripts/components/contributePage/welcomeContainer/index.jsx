import React from 'react';
import Icon from '../../../icons';
import styles from './welcomeContainer.scss';

const WelcomeContainer = () =>
  <div className={styles.welcomeContainer}>
    <div className={styles.innerContainer}>
      <Icon icon="SLOT_COIN" />
      <div className={styles.title}>
        Welcome to SlotNSlot <span>Crowdsale</span>
      </div>
      <div className={styles.content}>The crowdsale period starts on the 20th of August 2017, 08:00 UTC+0</div>
    </div>
  </div>;

export default WelcomeContainer;
