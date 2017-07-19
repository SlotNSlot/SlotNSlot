import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllSlotMachines, handleClickSortingOption, handleSortDropdownOpen } from './actions';
import Spinner from '../common/spinner';
import SortingHeader from './sortingHeader';
import ListHeader from './listHeader';
import SlotList from './slotList';
import styles from './slotList.scss';

function mapStateToProps(appState) {
  return {
    rootState: appState.root,
    slotListState: appState.slotList,
  };
}

class SlotListContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleToggleDropdown = this.handleToggleDropdown.bind(this);
    this.handleClickSortingOption = this.handleClickSortingOption.bind(this);
  }

  componentDidMount() {
    this.getSlotMachines();
  }

  getSlotMachines() {
    const { dispatch } = this.props;
    dispatch(getAllSlotMachines());
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
      content = <div>Sorry. We had error to get slot machines.</div>;
    } else if (!slotListState.get('allSlotContracts') || !slotListState.get('allSlotContracts').size === 0) {
      content = <div>We don't have any slot machines yet.</div>;
    } else {
      content = <SlotList slotContracts={slotListState.get('allSlotContracts')} />;
    }

    return (
      <div className={styles.slotListContainer}>
        <ListHeader />
        <div>
          <SortingHeader
            headerTitle="All Slots"
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

export default withRouter(connect(mapStateToProps)(SlotListContainer));
