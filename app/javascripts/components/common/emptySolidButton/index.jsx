import React from 'react';
import styles from './emptySolidButton.scss';

const EmptySolidButton = ({
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
      className={`${styles.emptySolidButton} ${className}`}
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

export default EmptySolidButton;
