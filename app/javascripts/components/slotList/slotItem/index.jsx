import React from 'react';
import { Link } from 'react-router-dom';
import formatNumberAsK from '../../../helpers/kFormatter';
import styles from './slotItem.scss';

const SlotListItem = ({ slotContract }) => {
  return (
    <Link to={`/slot/play/${slotContract.address}`}>
      <li className={styles.slotListItem}>
        <h2 className={styles.itemTitle}>
          {slotContract.address}
        </h2>
        <div className={styles.infoWrapper}>
          <span className={styles.itemInfo}>
            <div className={styles.infoTitle}>Total Stake</div>
            <div className={styles.infoValue}>
              {`${formatNumberAsK(slotContract.bankRoll)} ETH`}
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
            {`BET Range${slotContract.minBet} - ${slotContract.maxBet} ETH`}
          </span>
        </div>
      </li>
    </Link>
  );
};

export default SlotListItem;
