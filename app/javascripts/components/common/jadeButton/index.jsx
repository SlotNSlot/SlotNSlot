import React from 'react';
import styles from './jadeButton.scss';

const JadeButton = ({ isSelected, buttonText, className, overrideStyles = {}, value, isSubmit = false }) => {
  return (
    <button
      style={overrideStyles}
      type={isSubmit ? 'submit' : 'button'}
      className={`${styles.jadeButton} ${className} ${isSelected ? styles.active : ''}`}
      value={value}
    >
      {buttonText}
    </button>
  );
};

export default JadeButton;
