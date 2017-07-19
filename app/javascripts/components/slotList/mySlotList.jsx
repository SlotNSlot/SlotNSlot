import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getMySlotMachines, handleClickSortingOption, handleSortDropdownOpen } from './actions';
import Spinner from '../common/spinner';
import SlotList from './slotList';
import SortingHeader from './sortingHeader';
import ListHeader from './listHeader';
import styles from './slotList.scss';

function mapStateToProps(appState) {
  return {
    rootState: appState.root,
    slotListState: appState.slotList,
  };
}

class MySlotListContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleToggleDropdown = this.handleToggleDropdown.bind(this);
    this.handleClickSortingOption = this.handleClickSortingOption.bind(this);
  }

  componentDidMount() {
    this.getSlotMachines();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.rootState.get('account') !== this.props.rootState.get('account')) {
      this.getSlotMachines();
    }
  }

  async getSlotMachines() {
    const { dispatch, rootState } = this.props;

    if (rootState.get('account')) {
      await dispatch(getMySlotMachines(rootState.get('account')));
    }
  }

  handleToggleDropdown() {
    const { dispatch } = this.props;

    dispatch(handleSortDropdownOpen());
  }

  handleClickSortingOption(option) {
    const { dispatch } = this.props;

    dispatch(handleClickSortingOption(option));
  }

  render() {
    const { slotListState } = this.props;

    let content = null;
    // Handle Loading State
    if (slotListState.get('isLoading')) {
      content = (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      );
    } else if (slotListState.get('hasError')) {
      content = <div>Sorry. We had error to get your slot machines.</div>;
    } else {
      content = (
        <SlotList
          slotContracts={slotListState.get('mySlotContracts')}
          isMaking={slotListState.get('isMaking')}
          showMakeItem
        />
      );
    }

    return (
      <div className={styles.slotListContainer}>
        <ListHeader />
        <div>
          <SortingHeader
            headerTitle="My Slots"
            handleClickSortingOption={this.handleClickSortingOption}
            currentSortingOption={slotListState.get('sortOption')}
            isOpen={slotListState.get('isSortDropdownOpen')}
            handleToggle={this.handleToggleDropdown}
          />
          {content}
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(MySlotListContainer));
