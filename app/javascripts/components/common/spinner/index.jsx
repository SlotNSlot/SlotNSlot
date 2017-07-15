import React from 'react';
import styles from './spinner.scss';

const Spinner = ({ className = '' }) => {
  return (
    <div className={`${styles.spinner} ${className}`}>
      <div className={styles['double-bounce1']} />
      <div className={styles['double-bounce2']} />
    </div>
  );
};

export default Spinner;
