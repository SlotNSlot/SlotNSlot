import React from 'react';
import formatNumberAsK from '../../../helpers/kFormatter';
import styles from './slotItem.scss';

const SlotListItem = () => {
  return (
    <li className={styles.slotListItem}>
      <h2 className={styles.itemTitle}>Pang Pang Slot</h2>
      <div className={styles.infoWrapper}>
        <span className={styles.itemInfo}>
          <div className={styles.infoTitle}>Total Stake</div>
          <div className={styles.infoValue}>
            {`${formatNumberAsK(12.35)} ETH`}
          </div>
        </span>
        <span className={styles.itemInfo}>
          <div className={styles.infoTitle}>Max Win Prize</div>
          <div className={styles.infoValue}>
            {`x ${formatNumberAsK(10000)}`}
          </div>
        </span>
        <span className={styles.itemInfo}>
          <div className={styles.infoTitle}>Hit Ratio</div>
          <div className={styles.infoValue}>10 %</div>
        </span>
      </div>
      <div className={styles.footer}>
        <span className={styles.footerLeft}>Played 28 times</span>
        <span className={styles.footerRight}>BET Range 0.01 - 10 ETH</span>
      </div>
    </li>
  );
};

export default SlotListItem;
