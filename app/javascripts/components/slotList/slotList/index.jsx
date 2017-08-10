import React from 'react';
import SlotListItem from '../slotItem';
import NewSlotListItem from '../slotItem/newItem';
import styles from '../slotList.scss';

const SlotList = ({ slotContracts, isMaking = false, showMakeItem = false }) => {
  if (!slotContracts) {
    return null;
  }

  let newSlotNode = null;
  if (showMakeItem) {
    newSlotNode = <NewSlotListItem isMaking={isMaking} />;
  }

  const slotItemsNode = slotContracts.map(slotContract => {
    // TODO : remove Btn for removing bankrupted slots.
    return (
      <SlotListItem slotContract={slotContract} key={slotContract.get('contract').address} isBanker={showMakeItem} />
    );
  });

  return (
    <div className={styles.slotListWrapper}>
      <ul className={styles.slotList}>
        {newSlotNode}
        {slotItemsNode}
      </ul>
      {/*
        <div className={styles.paginationWrapper}>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
        */}
    </div>
  );
};

export default SlotList;
