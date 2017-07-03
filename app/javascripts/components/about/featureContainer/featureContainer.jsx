import React from 'react';
import styles from './featureContainer.scss';

const FeatureContainer = () =>
  <div className={styles.featureContainer}>
    <div className={styles.innerContainer}>
      <div className={styles.featureTitle}>Feature</div>
      <div className={styles.featureSubTitle}>A fast, cheap, ever-running slot game platform with 100% trust.</div>

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
            SlotNSlot creates a quick p2p session between operator and player of a slot. This will bypass the low
            throughput of Ethereum blockchain.
          </div>
        </div>
        <div className={styles.featureBlock}>
          <div className={styles.blockTitle}>Near-zero Cost</div>
          <div className={styles.blockText}>
            Every component of SlotNSlot are implemented with minimum computations and occasions so that transaction fee
            is at minimum.
          </div>
        </div>
        <div className={styles.featureBlock}>
          <div className={styles.blockTitle}>Provably Fair</div>
          <div className={styles.blockText}>
            Our RNG creates numbers that are equally unpredictable for everyone, using seeds from Ethereum, Operator,
            and Player.
          </div>
        </div>
        <div className={styles.featureBlock}>
          <div className={styles.blockTitle}>Communication</div>
          <div className={styles.blockText}>
            Both operators and players can express their emotions in-game.<br />Win a huge prize and thank your
            opponent!
          </div>
        </div>
        <div className={styles.featureBlock}>
          <div className={styles.blockTitle}>Autonomous</div>
          <div className={styles.blockText}>
            No one owns SlotNSlot. Users and community rules the platform, and it never stops running!
          </div>
        </div>
      </div>
    </div>
  </div>;
export default FeatureContainer;
