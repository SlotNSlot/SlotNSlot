import React from 'react';
import { Link } from 'react-router-dom';
import ICON from '../../../icons';
import styles from './slotItem.scss';

const NewSlotListItem = () => {
  return (
    <Link to="/slot/make/1">
      <li className={styles.newSlotListItem}>
        <div className={styles.newSlotListItemContent}>
          <ICON className={styles.plusButtonWrapper} icon="SLOT_PLUS_BUTTON" />
          <h2 className={styles.newItemTitle}>Create New Slot</h2>
        </div>
      </li>
    </Link>
  );
};

export default NewSlotListItem;
