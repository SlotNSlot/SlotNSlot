import React from 'react';
// styles
import styles from './progress.scss';

const TOTAL_STEP_COUNT = 4;

const steps = currentStep => {
  const resultArr = [];

  for (let i = 0; i < TOTAL_STEP_COUNT; i++) {
    const className = styles[`stepContainer${i + 1}`];

    resultArr.push(
      <div
        key={`makeGameStepProgress_${i}`}
        className={i + 1 === currentStep ? `${className} ${styles.activeStep}` : className}
      >
        <div className={i + 1 <= currentStep ? styles.activeBall : styles.deactiveBall} />
        <div className={styles.stepCount}>
          {`STEP ${i + 1}`}
        </div>
      </div>,
    );
  }
  return resultArr;
};

const MakeGameProgress = ({ currentStep }) =>
  <div className={styles.progressContainer}>
    <div className={styles.progressBar}>
      <div style={{ width: `${(currentStep - 1) / 3 * 100}%` }} className={styles.currentProgress} />
      {steps(currentStep)}
    </div>
  </div>;

export default MakeGameProgress;
