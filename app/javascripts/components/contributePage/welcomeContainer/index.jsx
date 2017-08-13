import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../../icons';
import styles from './welcomeContainer.scss';
import { updateCountdown, updateCurrentEther } from './actions';

function mapStateToProps(appState) {
  return {
    contributePage: appState.contributePage,
  };
}

class WelcomeContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.updateTimer = this.updateTimer.bind(this);
  }

  componentDidMount() {
    this.counterInterval = setInterval(this.updateTimer, 1000 * 30);
    this.props.dispatch(updateCurrentEther(12000));
  }

  componentWillUnmount() {
    clearInterval(this.counterInterval);
  }

  render() {
    const { contributePage } = this.props;
    const curEther = contributePage.get('currentEther');
    const curRatio = curEther / 40000 * 100;
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
              <span className={styles.bold}>{contributePage.get('days')}</span> Days
              <span className={styles.bold}> {contributePage.get('hours')}</span> Hours
              <span className={styles.bold}> {contributePage.get('minutes')}</span> Minutes
            </span>
            &nbsp;left for <span className={styles.bold}>Crowdsale</span>
          </div>

          <div className={styles.statusBox}>
            <div className={styles.title}>Current Crowdfunding Status</div>
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div className={styles.filledBar} style={{ width: `${curRatio}%` }}>
                  <div className={styles.currentEther}>
                    {curEther.toLocaleString()} ETH
                  </div>
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

  updateTimer() {
    const { dispatch } = this.props;
    dispatch(updateCountdown());
  }
}

export default connect(mapStateToProps)(WelcomeContainer);
