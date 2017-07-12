import React from 'react';
import styles from './crowdSaleContainer.scss';
import Icon from '../../../icons';

const crowdSaleContainer = () =>
  <div className={styles.crowdSaleContainer}>
    <div className={styles.ticketContainer}>
      <Icon icon="CROWDSALE_TICKET" />
      <div className={styles.ticketTitle}>
        <strong>CROWDSALE</strong> Starts on <strong>August 15th</strong>, 2017
      </div>
      <div className={styles.timeCounter}>
        <div className={styles.counterCell}>
          <div className={styles.counterNumber}>34</div>
          <div className={styles.counterTag}>Days</div>
        </div>
        <div className={styles.timeColon}>:</div>
        <div className={styles.counterCell}>
          <div className={styles.counterNumber}>21</div>
          <div className={styles.counterTag}>Hours</div>
        </div>
        <div className={styles.timeColon}>:</div>
        <div className={styles.counterCell}>
          <div className={styles.counterNumber}>56</div>
          <div className={styles.counterTag}>Minutes</div>
        </div>
        <div className={styles.timeColon}>:</div>
        <div className={styles.counterCell}>
          <div className={styles.counterNumber}>32</div>
          <div className={styles.counterTag}>Seconds</div>
        </div>
      </div>
    </div>
  </div>;
export default crowdSaleContainer;
