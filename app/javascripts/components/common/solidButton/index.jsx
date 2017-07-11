import React from 'react';
import styles from './solidButton.scss';

const SolidButton = ({
  onClickFunc,
  buttonText,
  className,
  value,
  overrideStyles = {},
  isSubmit = false,
  disabled = false,
}) => {
  return (
    <button
      style={overrideStyles}
      type={isSubmit ? 'submit' : 'button'}
      className={`${styles.solidButton} ${className}`}
      value={value}
      disabled={disabled}
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

export default SolidButton;
