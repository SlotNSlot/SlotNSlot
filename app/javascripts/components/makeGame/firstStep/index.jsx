import React from 'react';
import JadeButton from '../../common/jadeButton';
import styles from './firstStep.scss';

export default class MakeGameFirstStep extends React.PureComponent {
  render() {
    return (
      <div className={styles.firstContainer}>
        <div className={styles.contentWrapper}>
          <h1 className={styles.title}>
            SETP 1. <span className={styles.strongTitle}>SET HIT RATIO</span>
          </h1>
          <h2 className={styles.subTitle}>The hit ratio is an ideal probability that a hit occurs in a slot.</h2>
          <div className={styles.buttonContainer}>
            <JadeButton isSelected={false} value={10} buttonText="10%" className={styles.hitButton} />
            <JadeButton isSelected={false} value={12.5} buttonText="12.5%" className={styles.hitButton} />
            <JadeButton isSelected={true} value={15} buttonText="15%" className={styles.hitButton} />
          </div>
        </div>
      </div>
    );
  }
}
