import React from 'react';
import styles from './featureContainer.scss';

const FeatureContainer = () =>
  <div className={styles.featureContainer}>
    <div className={styles.innerContainer}>
      <div className={styles.featureTitle}>Features</div>
      <div className={styles.featureSubTitle}>A fast, low-cost, ever-running slot game platform with 100% trust.</div>

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
            SlotNSlot uses a quick semi-p2p protocol between banker and player. The game response does not depend on
            blocktime of Ethereum.
          </div>
        </div>
        <div className={styles.featureBlock}>
          <div className={styles.blockTitle}>Near-zero Cost</div>
          <div className={styles.blockText}>
            RNGs, games, and platform designs generate minimum transactions and computations, reducing the cost.
          </div>
        </div>
        <div className={styles.featureBlock}>
          <div className={styles.blockTitle}>Provably Fair</div>
          <div className={styles.blockText}>
            RNG creates numbers that are equally unpredictable, using seeds from both banker and player. The design is
            fraud-proof.
          </div>
        </div>
        <div className={styles.featureBlock}>
          <div className={styles.blockTitle}>Communication</div>
          <div className={styles.blockText}>
            Both operators and players can express their emotions in-game.<br />Win a huge prize and provoke your
            opponent!
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
