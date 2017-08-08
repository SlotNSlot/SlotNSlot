import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import JadeButton from '../../common/jadeButton';
import SolidButton from '../../common/solidButton';
import Icon from '../../../icons';
// actions
import { selectHitRation } from '../actions';
// styles
import styles from './firstStep.scss';

function mapStateToProps(appState) {
  return {
    makeGameState: appState.makeGame,
  };
}

class MakeGameFirstStep extends React.PureComponent {
  render() {
    const { makeGameState } = this.props;

    const currentRatio = parseFloat(makeGameState.get('hitRatio'), 10);

    return (
      <div>
        <div className={styles.firstContainer}>
          <div className={styles.contentWrapper}>
            <h1 className={styles.title}>
              STEP 1. <span className={styles.strongTitle}>SET HIT RATIO</span>
            </h1>
            <h2 className={styles.subTitle}>The hit ratio is an ideal probability that a hit occurs in a slot.</h2>
            <div className={styles.buttonContainer}>
              <JadeButton
                onClickFunc={() => {
                  this.selectHitRatio(10);
                }}
                isSelected={currentRatio === 10}
                buttonText="10%"
                className={styles.hitButton}
              />
              <JadeButton
                onClickFunc={() => {
                  this.selectHitRatio(12.5);
                }}
                isSelected={currentRatio === 12.5}
                buttonText="12.5%"
                className={styles.hitButton}
              />
              <JadeButton
                onClickFunc={() => {
                  this.selectHitRatio(15);
                }}
                isSelected={currentRatio === 15}
                buttonText="15%"
                className={styles.hitButton}
              />
            </div>
            <div className={styles.cautionContainer}>
              <div className={styles.cautionWrapper}>
                <Icon className={styles.tipIcon} icon="TIP_BUBBLE" />
                <span className={styles.caution}>
                  The lower you set, the more chances you will earn money, but if you set it too low, players may not
                  get into the game.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.nextButtonWrapper}>
          <SolidButton
            onClickFunc={() => {
              this.goToNextPage();
            }}
            buttonText="NEXT >"
            disabled={!currentRatio}
            className={styles.hitButton}
          />
        </div>
      </div>
    );
  }

  goToNextPage() {
    const { dispatch } = this.props;

    dispatch(push('/slot/make/step/2'));
  }

  selectHitRatio(hitRatio) {
    const { dispatch } = this.props;

    dispatch(selectHitRation(hitRatio));
  }
}

export default withRouter(connect(mapStateToProps)(MakeGameFirstStep));
