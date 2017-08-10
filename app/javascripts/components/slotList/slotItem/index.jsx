import React from 'react';
import { Link } from 'react-router-dom';
import weiToEther from '../../../helpers/weiToEther';
import styles from './slotItem.scss';

const SlotListItem = ({ slotContract, isBanker }) => {
  const mPlayer = slotContract.get('meta').get('mPlayer');
  const nullPlayer = '0x0000000000000000000000000000000000000000';
  const isOccupied = mPlayer !== nullPlayer;

  const occupySignal = (
    <span
      title={isOccupied ? 'This slot is already occupied.' : 'This slot is empty.'}
      className={`${styles.occupySignal} ${isOccupied ? styles.isOccupied : ''}`}
    />
  );

  return (
    <Link
      to={`/slot/${isBanker ? 'make' : 'play'}/${slotContract.get('contract').address}`}
      className={`${slotContract.get('meta').get('mPlayer')}`}
    >
      <li className={styles.slotListItem}>
        <h2 className={styles.itemTitle}>
          ✨<span>{slotContract.get('meta').get('slotName')}</span>✨
        </h2>
        <div className={styles.infoWrapper}>
          <span className={styles.itemInfo}>
            <div className={styles.infoTitle}>Total Stake</div>
            <div className={styles.infoValue}>
              {`${slotContract.get('meta').get('bankRoll')} ETH`}
            </div>
          </span>
          <span className={styles.itemInfo}>
            <div className={styles.infoTitle}>Max Win Prize</div>
            <div className={styles.infoValue}>
              {`x ${slotContract.get('meta').get('maxPrize')}`}
            </div>
          </span>
          <span className={styles.itemInfo}>
            <div className={styles.infoTitle}>Hit Ratio</div>
            <div className={styles.infoValue}>
              {`${slotContract.get('meta').get('decider') / 10} %`}
            </div>
          </span>
        </div>
        <div className={styles.footer}>
          <span className={styles.footerCenter}>
            {`BET Range ${slotContract.get('meta').get('minBet')} - ${slotContract.get('meta').get('maxBet')} ETH`}
          </span>
        </div>
        {isBanker ? occupySignal : ''}
      </li>
    </Link>
  );
};

export default SlotListItem;
