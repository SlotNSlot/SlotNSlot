import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
// components
import Spinner from '../../common/spinner';
import SolidButton from '../../common/solidButton';
import EmptySolidButton from '../../common/emptySolidButton';
// actions
import { setSlotName, requestToMakeGame } from '../actions';
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

    let loadingElem = null;
    if (makeGameState.get('isLoading')) {
      loadingElem = (
        <div className={styles.loading}>
          <div>
            <Spinner className={styles.spinner} />
            <div className={styles.loadingTitle}>Creating slot...</div>
          </div>
        </div>
      );
    }

    return (
      <div>
        {loadingElem}
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
            disabled={!makeGameState.get('slotName')}
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

  makeSlotMachine() {
    const { dispatch, rootState, makeGameState } = this.props;

    const account = rootState.get('account');
    const hitRatio = parseFloat(makeGameState.get('hitRatio'), 10);
    const minBet = makeGameState.get('betMinValue');
    const maxBet = makeGameState.get('betMaxValue');
    const maxPrize = makeGameState.get('maxPrize');
    const totalStake = makeGameState.get('totalStake');
    const slotName = makeGameState.get('slotName');

    if (!account || !makeGameState.get('hitRatio') > 0 || !minBet || !maxBet) {
      return;
    }

    const makeGameParams = {
      account,
      minBet,
      maxBet,
      decider: hitRatio * 10,
      maxPrize,
      totalStake,
      slotName,
    };

    dispatch(requestToMakeGame(makeGameParams));
    dispatch(push('/slot/make'));
  }

  goToPage(step) {
    const { dispatch } = this.props;

    dispatch(push(`/slot/make/${step}`));
  }
}

export default withRouter(connect(mapStateToProps)(MakeGameCompleteStep));
