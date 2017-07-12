import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import Slider from 'react-rangeslider';
import Icon from '../../../icons';
import SolidButton from '../../common/solidButton';
import EmptySolidButton from '../../common/emptySolidButton';
// actions
import { handleTotalStakeChange } from '../actions';
// styles
import './sliderBasic.scss';
import styles from './secondStep.scss';

function mapStateToProps(appState) {
  return {
    rootState: appState.root,
    makeGameState: appState.makeGame,
  };
}

class MakeGameSecondStep extends React.PureComponent {
  componentDidMount() {
    if (this.maxEtherLabel) {
      this.maxEtherLabel.style.right = `-${parseFloat(this.maxEtherLabel.offsetWidth, 10) / 2}px`;
    }
  }

  render() {
    const { rootState, makeGameState } = this.props;

    return (
      <div>
        <div className={styles.secondContainer}>
          <div className={styles.contentWrapper}>
            <h1 className={styles.title}>
              STEP 2. <span className={styles.strongTitle}>SET TOTAL STAKE</span>
            </h1>
            <h2 className={styles.subTitle}>Total stake of ETH to wager on this slot machine</h2>
            <div className={styles.buttonContainer}>
              <div className={styles.stakeInputWrapper}>
                <input
                  className={styles.stakeInput}
                  type="number"
                  step="0.001"
                  min={0}
                  max={parseFloat(rootState.get('balance'), 10)}
                  onChange={e => {
                    this.handleTotalStakeChange(e);
                  }}
                  value={makeGameState.get('totalStake')}
                />
                <span className={styles.stakeInputUnit}>ETH</span>
              </div>
              <div className={styles.sliderWrapper}>
                <div className={styles.leftLabel}>0</div>
                <Slider
                  min={0}
                  max={parseFloat(rootState.get('balance'), 10)}
                  step={0.001}
                  value={parseFloat(makeGameState.get('totalStake'), 10)}
                  onChange={totalStake => {
                    this.handleSlideChange(totalStake);
                  }}
                />
                <div
                  ref={c => {
                    this.maxEtherLabel = c;
                  }}
                  className={styles.rightLabel}
                >
                  {rootState.get('balance')}
                </div>
              </div>
            </div>
            <div className={styles.cautionContainer}>
              <div className={styles.cautionWrapper}>
                <Icon className={styles.tipIcon} icon="TIP_BUBBLE" />
                <span className={styles.caution}>
                  To create a slot with a larger total shake, fill your wallet with more Ether
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.nextButtonWrapper}>
          <EmptySolidButton
            onClickFunc={() => {
              this.goToPage(1);
            }}
            buttonText="< BACK"
            disabled={false}
            className={styles.linkButton}
          />

          <SolidButton
            onClickFunc={() => {
              this.goToPage(3);
            }}
            buttonText="NEXT >"
            disabled={parseFloat(makeGameState.get('totalStake'), 10) === 0}
            className={styles.linkButton}
          />
        </div>
      </div>
    );
  }

  handleTotalStakeChange(e) {
    const { dispatch } = this.props;
    const totalStake = e.currentTarget.value;
    let cleanedTotalStake;

    const totalStakeValueArr = totalStake.split('.');
    if (totalStakeValueArr.length > 2) {
      alert('You should put valid stake');
      return;
    } else if (!totalStake) {
      cleanedTotalStake = 0;
    } else if (totalStakeValueArr[1] === '') {
      cleanedTotalStake = totalStake;
    } else if (totalStakeValueArr[1] !== undefined && totalStakeValueArr[1].length > 3) {
      cleanedTotalStake = parseFloat(totalStake, 10).toFixed(3);
    } else {
      cleanedTotalStake = parseFloat(totalStake, 10);
    }

    dispatch(handleTotalStakeChange(cleanedTotalStake));
  }

  handleSlideChange(totalStake) {
    const { dispatch } = this.props;
    const cleanedTotalStake = parseFloat(totalStake, 10).toFixed(3);
    dispatch(handleTotalStakeChange(cleanedTotalStake));
  }

  goToPage(step) {
    const { dispatch } = this.props;

    dispatch(push(`/slot/make/${step}`));
  }
}

export default withRouter(connect(mapStateToProps)(MakeGameSecondStep));
