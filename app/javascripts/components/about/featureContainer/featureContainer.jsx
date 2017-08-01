import React from 'react';
import styles from './featureContainer.scss';

const FeatureContainer = () =>
  <div className={styles.featureContainer}>
    <div className={styles.innerContainer}>
      <div className={styles.featureTitle}>Features</div>
      <div className={styles.featureSubTitle}>
        A fast, low-cost, ever-running slot game platform with no need for trust.
      </div>

      <div className={styles.featureWrapper}>
        <div className={styles.featureBlock}>
          <div className={styles.blockTitle}>Transparent</div>
          <div className={styles.blockText}>
            SlotNSlot runs on Ethereum blockchain, leaving all of its history on-chain. Anyone can find out the
            codes&play history from blockchain.
          </div>
        </div>
        <div className={styles.featureBlock}>
          <div className={styles.blockTitle}>Fast</div>
          <div className={styles.blockText}>
            SlotNSlot games proceed superfast with proactive transaction verifications, thus not depending on the
            blocktime of Ethereum.
          </div>
        </div>
        <div className={styles.featureBlock}>
          <div className={styles.blockTitle}>Near-zero Cost</div>
          <div className={styles.blockText}>
            RNGs, games, and platform designs generate minimum transactions and computations on-chain, thus extremely
            reducing the cost.
          </div>
        </div>
        <div className={styles.featureBlock}>
          <div className={styles.blockTitle}>Provably Fair</div>
          <div className={styles.blockText}>
            Random numbers on SlotNSlot are equally unpredictable, and cannot be manipulated. Fairness is verified with
            SHA3 hash chains.
          </div>
        </div>
        <div className={styles.featureBlock}>
          <div className={styles.blockTitle}>Communication</div>
          <div className={styles.blockText}>
            Send Emojis as you’d do in 1on1 arena games. Watch your opponent lose Ether and tease!
          </div>
        </div>
        <div className={styles.featureBlock}>
          <div className={styles.blockTitle}>Autonomous</div>
          <div className={styles.blockText}>
            No one owns SlotNSlot. Users and community rule the platform, and it never stops running!
          </div>
        </div>
      </div>
    </div>
  </div>;
export default FeatureContainer;
