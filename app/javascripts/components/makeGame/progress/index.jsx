import React from 'react';
import { Link } from 'react-router-dom';
// styles
import styles from './progress.scss';

const TOTAL_STEP_COUNT = 4;

const steps = currentStep => {
  const resultArr = [];

  for (let i = 0; i < TOTAL_STEP_COUNT; i++) {
    const className = styles[`stepContainer${i + 1}`];

    let progressBall;
    if (i + 1 <= currentStep) {
      progressBall = (
        <Link to={`/slot/make/${i + 1}`} className={i + 1 <= currentStep ? styles.activeBall : styles.deactiveBall} />
      );
    } else {
      progressBall = (
        <div to={`/slot/make/${i + 1}`} className={i + 1 <= currentStep ? styles.activeBall : styles.deactiveBall} />
      );
    }

    resultArr.push(
      <div
        key={`makeGameStepProgress_${i}`}
        className={i + 1 === currentStep ? `${className} ${styles.activeStep}` : className}
      >
        {progressBall}
        <div className={styles.stepCount}>
          {`STEP ${i + 1}`}
        </div>
      </div>,
    );
  }
  return resultArr;
};

const MakeGameProgress = ({ currentStep }) => {
  if (currentStep === 'complete') {
    return null;
  }

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div style={{ width: `${(parseInt(currentStep, 10) - 1) / 3 * 100}%` }} className={styles.currentProgress} />
        {steps(parseInt(currentStep, 10))}
      </div>
    </div>
  );
};

export default MakeGameProgress;
