import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSlotMachines, handleClickSortingOption, handleSortDropdownOpen } from './actions';
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.rootState.get('account')) {
      this.getSlotMachines();
    }
  }

  getSlotMachines() {
    const { dispatch, rootState } = this.props;

    if (rootState.get('account')) {
      dispatch(getSlotMachines(rootState.get('account')));
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

    return (
      <div className={styles.slotListContainer}>
        <ListHeader />
        <div>
          <SortingHeader
            handleClickSortingOption={this.handleClickSortingOption}
            currentSortingOption={slotListState.get('sortOption')}
            isOpen={slotListState.get('isSortDropdownOpen')}
            handleToggle={this.handleToggleDropdown}
          />
          <SlotList />
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(SlotListContainer));
