import React from 'react';
import SlotListItem from '../slotItem';
import styles from '../slotList.scss';

const SlotList = ({ slotContracts }) => {
  if (!slotContracts) {
    return null;
  }

  const slotItemsNode = slotContracts.map(slotContract => {
    return <SlotListItem slotContract={slotContract} key={slotContract.address} />;
  });

  return (
    <div className={styles.slotListWrapper}>
      <ul className={styles.slotList}>
        {slotItemsNode}
      </ul>
      <div className={styles.paginationWrapper}>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
    </div>
  );
};

export default SlotList;
