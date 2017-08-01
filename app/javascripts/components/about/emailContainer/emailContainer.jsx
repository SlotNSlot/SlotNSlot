import React from 'react';
import Axios from 'axios';
import styles from './emailContainer.scss';
import Icon from '../../../icons';
import CrowdSaleContainer from '../crowdSaleContainer/crowdSaleContainer';

class EmailContainer extends React.PureComponent {
  render() {
    return (
      <div className={styles.emailComponent}>
        <div className={styles.emailContainer}>
          <div>
            <div className={styles.emailTitle}>
              The World First online <span>Slot Machine Platform</span>, running on <span>Ethereum</span>
            </div>
            <div className={styles.subTitle}>
              Make <span>your own Slots</span>! Play on others and ruin them!
            </div>

            <a href="https://youtu.be/9TtOFJ2InH8" target="_blank" className={styles.watchDemoBtn}>
              <Icon className={styles.triangle} icon="TRIANGLE_RIGHT" />
              Watch Demo
            </a>
          </div>
        </div>
        <CrowdSaleContainer />
      </div>
    );
  }
}
export default EmailContainer;
