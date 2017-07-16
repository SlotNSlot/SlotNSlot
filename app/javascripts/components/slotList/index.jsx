import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSlotMachines } from './actions';
import ListHeader from './listHeader';
import SlotList from './slotList';
import styles from './slotList.scss';

function mapStateToProps(appState) {
  return {
    rootState: appState.root,
  };
}

class SlotListContainer extends React.PureComponent {
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

  render() {
    return (
      <div className={styles.slotListContainer}>
        <ListHeader />
        <div>
          <div className={styles.sortingHeader}>
            <div className={styles.headerLeft}>All Slots</div>
            <div className={styles.headerRight}>Sort: Last Active</div>
          </div>
          <SlotList />
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(SlotListContainer));
