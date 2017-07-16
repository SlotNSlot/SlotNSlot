import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSlotMachines } from './actions';
import SlotList from './slotList';
import styles from './slotList.scss';

function mapStateToProps(appState) {
  return {
    rootState: appState.root,
  };
}

class MySlotListContainer extends React.PureComponent {
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
        <div className={styles.background2}>
          <div className={styles.headerContainer}>
            <div className={styles.headerTitle}>
              <strong>SlotNSlot</strong> is<br />
              The World First <strong>Online Slot Machine</strong>
              <br />
              <strong>Platform</strong>, running on <strong>Ethereum</strong>
            </div>
            <button className={styles.infoButton}>More Information</button>
          </div>
        </div>
        <div>
          <div className={styles.sortingHeader}>
            <div className={styles.headerLeft}>My Slots</div>
            <div className={styles.headerRight}>Sort: Last Active</div>
          </div>
          <SlotList />
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(MySlotListContainer));
