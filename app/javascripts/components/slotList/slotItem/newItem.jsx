import React from 'react';
import { Link } from 'react-router-dom';
import ICON from '../../../icons';
import Spinner from '../../common/spinner';
import styles from './slotItem.scss';

const NewSlotListItem = ({ isMaking = false }) => {
  let content;
  if (isMaking) {
    content = (
      <div>
        <Spinner className={styles.spinner} />
        <h2 className={styles.newItemTitle}>Your slot is being made now...</h2>
      </div>
    );
  } else {
    content = (
      <div>
        <ICON className={styles.plusButtonWrapper} icon="SLOT_PLUS_BUTTON" />
        <h2 className={styles.newItemTitle}>Create New Slot</h2>
      </div>
    );
  }

  return (
    <Link to="/slot/make/step/1">
      <li className={styles.newSlotListItem}>
        <div className={styles.newSlotListItemContent}>
          {content}
        </div>
      </li>
    </Link>
  );
};

export default NewSlotListItem;
