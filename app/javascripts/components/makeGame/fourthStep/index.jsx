import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import Icon from '../../../icons';
import SolidButton from '../../common/solidButton';
import EmptySolidButton from '../../common/emptySolidButton';
// actions
import { setBetMinValue, setBetMaxValue } from '../actions';
// styles
import styles from './fourthStep.scss';

function mapStateToProps(appState) {
  return {
    rootState: appState.root,
    makeGameState: appState.makeGame,
  };
}

class MakeGameFourthStep extends React.PureComponent {
  constructor(props) {
    super(props);

    this.validateValidValues = this.validateValidValues.bind(this);
  }

  render() {
    const { makeGameState } = this.props;

    let maxBet = 0;
    if (makeGameState.get('maxPrize') && makeGameState.get('totalStake')) {
      maxBet = parseFloat(makeGameState.get('totalStake'), 10) / parseFloat(makeGameState.get('maxPrize'), 10);
    }

    const nextButtonState = this.validateValidValues();

    return (
      <div>
        <div className={styles.fourthContainer}>
          <div className={styles.contentWrapper}>
            <h1 className={styles.title}>
              STEP 4. <span className={styles.strongTitle}>SET BET RANGE</span>
            </h1>
            <h2 className={styles.subTitle}>Players can wager on every bet an amount within the range you set</h2>
            <div className={styles.betContainer}>
              <div className={styles.betInputWrapper}>
                <input
                  className={styles.betInput}
                  type="number"
                  step="0.001"
                  min={0}
                  max={maxBet || 10}
                  onChange={e => {
                    this.handleValueChange(e, 'min');
                  }}
                  value={makeGameState.get('betMinValue')}
                />
              </div>
              <span className={styles.horizontalDivider}>-</span>
              <div className={styles.betInputWrapper}>
                <input
                  className={styles.betInput}
                  type="number"
                  step="0.001"
                  min={0}
                  max={maxBet || 10}
                  onChange={e => {
                    this.handleValueChange(e, 'max');
                  }}
                  value={makeGameState.get('betMaxValue')}
                />
                <span className={styles.betInputUnit}>ETH</span>
              </div>
            </div>
            <div className={styles.cautionContainer}>
              <div className={styles.cautionWrapper}>
                <Icon className={styles.tipIcon} icon="TIP_BUBBLE" />
                <span className={styles.caution}>
                  Set a proper range regarding your total stake. A relatively too high maximum bet amount would run out
                  your stake quickly.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.nextButtonWrapper}>
          <EmptySolidButton
            onClickFunc={() => {
              this.goToPage(3);
            }}
            buttonText="< BACK"
            disabled={false}
            className={styles.linkButton}
          />

          <SolidButton
            onClickFunc={() => {
              this.goToPage('complete');
            }}
            buttonText="NEXT >"
            disabled={!nextButtonState}
            className={styles.linkButton}
          />
        </div>
      </div>
    );
  }

  validateValidValues() {
    const { makeGameState } = this.props;

    return (
      parseFloat(makeGameState.get('betMinValue'), 10) !== 0 &&
      parseFloat(makeGameState.get('betMaxValue'), 10) !== 0 &&
      parseFloat(makeGameState.get('betMinValue'), 10) < parseFloat(makeGameState.get('betMaxValue'), 10)
    );
  }

  handleValueChange(e, filed) {
    const { dispatch } = this.props;
    const originalValue = e.currentTarget.value;

    let value;
    const originalValueValueArr = originalValue.split('.');

    if (originalValueValueArr.length > 2) {
      alert('You should put valid stake');
      return;
    } else if (!originalValue) {
      value = 0;
    } else if (originalValueValueArr[1] === '') {
      value = originalValue;
    } else if (originalValueValueArr[1] !== undefined && originalValueValueArr[1].length > 3) {
      value = parseFloat(originalValue, 10).toFixed(3);
    } else {
      value = parseFloat(originalValue, 10);
    }

    if (filed === 'min') {
      dispatch(setBetMinValue(value));
    } else {
      dispatch(setBetMaxValue(value));
    }
  }

  goToPage(step) {
    const { dispatch } = this.props;

    dispatch(push(`/slot/make/${step}`));
  }
}

export default withRouter(connect(mapStateToProps)(MakeGameFourthStep));
