import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import SolidButton from '../../common/solidButton';
import EmptySolidButton from '../../common/emptySolidButton';
// helpers
import Web3Helper from '../../../helpers/web3Service';
// actions
import { setSlotName } from '../actions';
// styles
import styles from './completeStep.scss';

function mapStateToProps(appState) {
  return {
    rootState: appState.root,
    makeGameState: appState.makeGame,
  };
}

class MakeGameCompleteStep extends React.PureComponent {
  render() {
    const { makeGameState } = this.props;

    return (
      <div>
        <h1 className={styles.title}>
          COMPLETE. <span className={styles.strongTitle}>SET SLOT NAME</span>
        </h1>
        <h2 className={styles.subTitle}>Check all slot parameter and give your slot a name</h2>
        <div className={styles.completeContainer}>
          <div className={styles.contentWrapper}>
            <div className={styles.infoRow}>
              <span className={styles.infoItem}>{`HIT RATIO : ${makeGameState.get('hitRatio')}`}</span>
              <span className={styles.infoItem}>{`BET RANGE : ${makeGameState.get('betMinValue')} - ${makeGameState.get(
                'betMaxValue',
              )} ETH`}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoItem}>{`TOTAL STAKE : ${makeGameState.get('totalStake')}`}</span>
              <span className={styles.infoItem}>{`MAX PRIZE : x ${makeGameState.get('maxPrize')}`}</span>
            </div>
          </div>
        </div>

        <div className={styles.slotNameInputWrapper}>
          <span className={styles.slotNameInputLabel}>SLOT NAME</span>
          <input
            onChange={e => {
              this.handleSlotnameChange(e);
            }}
            type="test"
            className={styles.slotNameInput}
          />
        </div>

        <div className={styles.nextButtonWrapper}>
          <EmptySolidButton
            onClickFunc={() => {
              this.goToPage(4);
            }}
            buttonText="< BACK"
            disabled={false}
            className={styles.linkButton}
          />

          <SolidButton
            onClickFunc={() => {
              this.makeSlotMachine();
            }}
            buttonText="CONFIRM"
            disabled={!makeGameState.get('slotname')}
            className={styles.linkButton}
          />
        </div>
      </div>
    );
  }

  handleSlotnameChange(e) {
    const { dispatch } = this.props;

    dispatch(setSlotName(e.currentTarget.value));
  }

  async makeSlotMachine() {
    const { dispatch, rootState } = this.props;

    try {
      const transaction = await Web3Helper.createSlotMachine(rootState.get('account'));
      alert(`Made Slot Machine successfully. It spend ${transaction.gasPrice.valueOf()} WEI at ${transaction.tx}`);
      dispatch(push('/'));
    } catch (err) {
      alert(err);
    }
  }

  goToPage(step) {
    const { dispatch } = this.props;

    dispatch(push(`/slot/make/${step}`));
  }
}

export default withRouter(connect(mapStateToProps)(MakeGameCompleteStep));
