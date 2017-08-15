import React from 'react';
import Axios from 'axios';
import ReactGA from 'react-ga';
import { logException } from '../../../helpers/errorLogger';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import JadeButton from '../../common/jadeButton';
import SolidButton from '../../common/solidButton';
import Icon from '../../../icons';
import ReactModal from 'react-modal';
import { AVAILABLE_ADWORDS_TYPE, handleAdwordsAction } from '../../../helpers/handleAdwordsAction';
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
  async subscribeEmail(e) {
    e.preventDefault();
    const emailInput = this.emailInput.value;
    // e-mail validation by regular expression
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reg.test(emailInput)) {
      alert('Please input valid e-mail');
    } else {
      try {
        await Axios.post(
          `https://uabahwzd5e.execute-api.us-east-1.amazonaws.com/prod/subscribeMailingList?email=${emailInput}`,
        );

        ReactGA.event({
          category: 'subscribe',
          action: 'subscribe-from-top-EmailContainer',
          label: 'subscribe-email',
        });
        handleAdwordsAction(AVAILABLE_ADWORDS_TYPE.EMAIL_SUBSCRIBE);
        alert('You are on the subscribe list now');
        this.emailInput.value = '';
        this.returnToPlay();
      } catch (err) {
        logException(err);
        alert(`Failed: ${err.response.data.error}`);
      }
    }
  }

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

        <ReactModal
          isOpen
          contentLabel="Block making Modal"
          className={styles.blockModal}
          overlayClassName={styles.blockModalOverlay}
          onRequestClose={() => this.returnToPlay()}
        >
          <div className={styles.modalContainer}>
            <button className={styles.closeBtn} onClick={() => this.returnToPlay()}>
              <Icon icon="CANCEL" />
            </button>
            <p className={styles.modalTitle}>The ‘Make’ function is not available in beta.</p>
            <p className={styles.modalContent}>
              The SlotNSlot team is working hard to stabilize the service.<br />
              Please write your email below, then we will send you a reminder email when a formal product is available.
            </p>

            <form
              onSubmit={e => {
                this.subscribeEmail(e);
              }}
              className={styles.emailForm}
            >
              <div className={styles.emailInputWrapper}>
                <input
                  ref={c => {
                    this.emailInput = c;
                  }}
                  className={styles.emailInput}
                  placeholder="Enter your email address"
                />
                <button type="submit" className={styles.subscribeBtn}>
                  Subscribe
                </button>
              </div>
            </form>

            <p className={styles.noBtn} onClick={() => this.returnToPlay()}>
              No, thanks
            </p>
          </div>
        </ReactModal>
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

  returnToPlay() {
    const { dispatch } = this.props;

    dispatch(push('/slot/play'));
  }
}

export default withRouter(connect(mapStateToProps)(MakeGameFirstStep));
