import React from 'react';
import styles from './detailContainer.scss';

const DetailContainer = () =>
  <div className={styles.detailContainer}>
    <div className={styles.innerContainer}>
      <div className={styles.itemBox}>
        <div className={styles.title}>CROWDSALE PERIOD</div>
        <div className={styles.period}>
          <div className={styles.content}>
            <div className={styles.periodTitle}>START TIME</div>
            <div className={styles.periodTime}>
              <span>August 20th, 2017</span>
              <br />
              08:00AM UTC+0
            </div>
          </div>
          <div className={styles.dash} />
          <div className={styles.content}>
            <div className={styles.periodTitle}>END TIME</div>
            <div className={styles.periodTime}>
              <span>September 3rd, 2017</span>
              <br />
              08:00AM UTC+0
            </div>
          </div>
        </div>
      </div>

      <div className={styles.itemBox}>
        <div className={styles.title}>CONTRIBUTION HARD CAP</div>
        <div className={`${styles.content} ${styles.hardCap}`}>100,000 ETH</div>
      </div>

      <div className={styles.itemBox}>
        <div className={styles.title}>PRICE</div>
        <div className={`${styles.content} ${styles.price}`}>
          1) 12,000 SLOT / ETH : 20% bonus for the first 24 hours <br />
          2) 10,000 SLOT / ETH : after 24 hours until the end of crowdsale
        </div>
      </div>

      <div className={styles.itemBox}>
        <div className={styles.title}>INVESTOR PROTECTIONS</div>
        <div className={`${styles.content} ${styles.protection}`}>
          <p>i) Funds will have Yearly Upper bounds on use</p>
          <p>
            ii) Financial reports on use of fund will be updated every month on all SlotNSlot communication channels
          </p>
          <p>
            iii) Foundation stake will be locked up to the day 1 year after the first platform profit distribution is
            witnessed
          </p>
          <p>
            iv) On suspention, completion, or transition to an autonomous mode of the project, remaining fund will be
            decided to a) refund b) buyback tokens, or c) reward bounty programs.
          </p>
          <p>
            v) Token holders can initiate proposals and vote on them, to make decisions on the project and its fund use,
            including i) and iv).
          </p>
        </div>
      </div>
      <a
        href="https://keepingstock.net/better-ico-investors-must-be-protected-84b760fda5f0"
        target="_blank"
        className={styles.moreBtn}
      >
        More Detail
      </a>
    </div>
  </div>;

export default DetailContainer;
