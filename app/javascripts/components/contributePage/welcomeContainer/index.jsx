import React from 'react';
import Icon from '../../../icons';
import styles from './welcomeContainer.scss';

class WelcomeContainer extends React.PureComponent {
  render() {
    return (
      <div className={styles.welcomeContainer}>
        <div className={styles.innerContainer}>
          <Icon icon="SLOT_COIN" />

          <div className={styles.title}>
            Welcome to SlotNSlot <span>Crowdsale</span>
          </div>

          <div className={styles.content}>
            CROWDSALE Period : August 20th, 2017, 08:00 UTC - September 17rd, 2017, 08:00 UTC
          </div>

          <div className={styles.remainTime}>
            <span className={styles.underline}>
              <span className={styles.bold}>08</span> Days
              <span className={styles.bold}> 12</span> Hours
              <span className={styles.bold}> 05</span> Minutes
            </span>
            &nbsp;left for <span className={styles.bold}>Crowdsale</span>
          </div>

          <div className={styles.statusBox}>
            <div className={styles.title}>Current Crowdfunding Status</div>
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div className={styles.filledBar}>
                  <div className={styles.currentEther}>72,000 ETH</div>
                </div>
                <span className={styles.minCap}>0 ETH</span>
                <span className={styles.maxCap}>40,000 ETH</span>
              </div>
            </div>
          </div>
          <button onClick={() => alert('i')} className={styles.contributeBtn}>
            Contribute
          </button>
        </div>
      </div>
    );
  }
}

export default WelcomeContainer;
