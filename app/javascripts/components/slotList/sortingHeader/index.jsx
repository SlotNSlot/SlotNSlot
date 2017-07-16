import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { SORT_OPTIONS } from '../reducer';
import styles from '../slotList.scss';

class SortingHeader extends React.PureComponent {
  render() {
    const { isOpen, handleToggle, currentSortingOption, handleClickSortingOption } = this.props;

    return (
      <div className={styles.sortingHeader}>
        <div className={styles.headerLeft}>All Slots</div>
        <div className={styles.headerRight}>
          <Dropdown isOpen={isOpen} toggle={handleToggle}>
            <DropdownToggle className={styles.dropdownToggle} caret>
              {`Sort: ${currentSortingOption}`}
            </DropdownToggle>
            <DropdownMenu className={styles.dropdownMenu} right>
              <DropdownItem
                className={styles.dropdownItem}
                onClick={() => {
                  handleClickSortingOption(SORT_OPTIONS.lastActive);
                }}
              >
                Last Active
              </DropdownItem>
              <DropdownItem
                className={styles.dropdownItem}
                onClick={() => {
                  handleClickSortingOption(SORT_OPTIONS.highStake);
                }}
              >
                High Stake
              </DropdownItem>
              <DropdownItem
                className={styles.dropdownItem}
                onClick={() => {
                  handleClickSortingOption(SORT_OPTIONS.lowBetSize);
                }}
              >
                Low Bet Size
              </DropdownItem>
              <DropdownItem
                className={styles.dropdownItem}
                onClick={() => {
                  handleClickSortingOption(SORT_OPTIONS.highBetSize);
                }}
              >
                High Bet Size{' '}
              </DropdownItem>
              <DropdownItem
                className={styles.dropdownItem}
                onClick={() => {
                  handleClickSortingOption(SORT_OPTIONS.highHitRatio);
                }}
              >
                High Hit Ratio
              </DropdownItem>
              <DropdownItem
                className={styles.dropdownItem}
                onClick={() => {
                  handleClickSortingOption(SORT_OPTIONS.popular);
                }}
              >
                Popular
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default SortingHeader;
