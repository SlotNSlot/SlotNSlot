import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import JadeButton from '../../common/jadeButton';
import EmptySolidButton from '../../common/emptySolidButton';
import SolidButton from '../../common/solidButton';
import Icon from '../../../icons';
// actions
import { setMaxPrize } from '../actions';
// styles
import styles from './thirdStep.scss';

function mapStateToProps(appState) {
  return {
    makeGameState: appState.makeGame,
  };
}

class MakeGameFirstStep extends React.PureComponent {
  render() {
    const { makeGameState } = this.props;

    const maxPrize = parseInt(makeGameState.get('maxPrize'), 10);

    return (
      <div>
        <div className={styles.thirdContainer}>
          <div className={styles.contentWrapper}>
            <h1 className={styles.title}>
              STEP 3. <span className={styles.strongTitle}>SET MAX PRIZE</span>
            </h1>
            <h2 className={styles.subTitle}>Sets the maximum compensation that can come out of the slot</h2>
            <div className={styles.buttonContainer}>
              <JadeButton
                onClickFunc={() => {
                  this.setMaxPrize(100);
                }}
                isSelected={maxPrize === 100}
                buttonText="x 100"
                className={styles.hitButton}
              />
              <JadeButton
                onClickFunc={() => {
                  this.setMaxPrize(1000);
                }}
                isSelected={maxPrize === 1000}
                buttonText="x 1k"
                className={styles.hitButton}
              />
              <JadeButton
                onClickFunc={() => {
                  this.setMaxPrize(3000);
                }}
                isSelected={maxPrize === 3000}
                buttonText="x 3k"
                className={styles.hitButton}
              />
            </div>
            <div className={styles.cautionContainer}>
              <div className={styles.cautionWrapper}>
                <Icon className={styles.tipIcon} icon="TIP_BUBBLE" />
                <span className={styles.caution}>
                  A larger prize would occur less. A smaller prize would take place more often.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.nextButtonWrapper}>
          <EmptySolidButton
            onClickFunc={() => {
              this.goToPage(2);
            }}
            buttonText="< BACK"
            disabled={false}
            className={styles.linkButton}
          />

          <SolidButton
            onClickFunc={() => {
              this.goToPage(4);
            }}
            buttonText="NEXT >"
            disabled={!makeGameState.get('maxPrize')}
            className={styles.linkButton}
          />
        </div>
      </div>
    );
  }

  goToPage(step) {
    const { dispatch } = this.props;

    dispatch(push(`/slot/make/${step}`));
  }

  setMaxPrize(hitRatio) {
    const { dispatch } = this.props;

    dispatch(setMaxPrize(hitRatio));
  }
}

export default withRouter(connect(mapStateToProps)(MakeGameFirstStep));
