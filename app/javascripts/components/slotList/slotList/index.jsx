import React from 'react';
import SlotListItem from '../slotItem';
import styles from '../slotList.scss';

const SlotList = () => {
  const items = [1, 2, 3, 4, 5, 6];
  const slotItemsNode = items.map(item => {
    return <SlotListItem key={item} />;
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
