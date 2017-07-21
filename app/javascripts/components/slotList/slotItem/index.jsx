import React from 'react';
import { Link } from 'react-router-dom';
import formatNumberAsK from '../../../helpers/kFormatter';
import styles from './slotItem.scss';

const SlotListItem = ({ slotContract }) => {
  const mPlayer = slotContract.get('meta').get('mPlayer');
  const nullPlayer = '0x0000000000000000000000000000000000000000';
  return (
    <Link
      to={`/slot/play/${slotContract.get('contract').address}`}
      className={`${slotContract.get('meta').get('mPlayer')}`}
    >
      <li className={`${styles.slotListItem} ${mPlayer === nullPlayer ? styles.isBlank : styles.isOccupied}`}>
        <h2 className={styles.itemTitle}>
          {slotContract.get('contract').address}
        </h2>
        <div className={styles.infoWrapper}>
          <span className={styles.itemInfo}>
            <div className={styles.infoTitle}>Total Stake</div>
            <div className={styles.infoValue}>
              {`${formatNumberAsK(slotContract.get('meta').get('bankRoll'))} ETH`}
            </div>
          </span>
          <span className={styles.itemInfo}>
            <div className={styles.infoTitle}>Max Win Prize</div>
            <div className={styles.infoValue}>
              {`x ${formatNumberAsK(100000)}`}
            </div>
          </span>
          <span className={styles.itemInfo}>
            <div className={styles.infoTitle}>Hit Ratio</div>
            <div className={styles.infoValue}>10 %</div>
          </span>
        </div>
        <div className={styles.footer}>
          <span className={styles.footerLeft}>Played 28 times</span>
          <span className={styles.footerRight}>
            {`BET Range${slotContract.get('meta').get('minBet')} - ${slotContract.get('meta').get('maxBet')} ETH`}
          </span>
        </div>
      </li>
    </Link>
  );
};

export default SlotListItem;
