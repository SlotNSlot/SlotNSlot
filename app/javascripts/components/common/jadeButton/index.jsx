import React from 'react';
import styles from './jadeButton.scss';

const JadeButton = ({
  onClickFunc,
  isSelected,
  buttonText,
  className,
  value,
  overrideStyles = {},
  isSubmit = false,
}) => {
  return (
    <button
      style={overrideStyles}
      type={isSubmit ? 'submit' : 'button'}
      className={`${styles.jadeButton} ${className} ${isSelected ? styles.active : ''}`}
      value={value}
      onClick={
        onClickFunc
          ? onClickFunc
          : () => {
              return;
            }
      }
    >
      {buttonText}
    </button>
  );
};

export default JadeButton;
