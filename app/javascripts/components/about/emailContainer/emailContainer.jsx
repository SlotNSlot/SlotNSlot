import React from 'react';
import Axios from 'axios';
import ReactGA from 'react-ga';
import styles from './emailContainer.scss';
import CrowdSaleContainer from '../crowdSaleContainer/crowdSaleContainer';
import { AVAILABLE_ADWORDS_TYPE, handleAdwordsAction } from '../../../helpers/handleAdwordsAction';
import Icon from '../../../icons';

class EmailContainer extends React.PureComponent {
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
      } catch (err) {
        alert(`Failed: ${err.response.data.error}`);
      }
    }
  }

  render() {
    return (
      <div className={styles.emailComponent}>
        <div className={styles.emailContainer}>
          <div>
            <div className={styles.emailTitle}>
              The World First online <span>Slot Machine Platform</span>, running on <span>Ethereum</span>
            </div>
            <div className={styles.subTitle}>
              Make <span>your own Slots</span>! Play on others and ruin them!
            </div>

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

            <div className={styles.linkBlock}>
              <a className={styles.btnContainer} href="https://t.me/slotnslot_ico" target="_blank">
                <Icon className={styles.snsBtn} icon="TELEGRAM" />
              </a>
              <a className={styles.btnContainer} href="https://www.facebook.com/slotnslot.eth" target="_blank">
                <Icon className={styles.snsBtn} icon="FACEBOOK" />
              </a>
              <a className={styles.btnContainer} href="https://github.com/SlotNSlot/SlotNSlot" target="_blank">
                <Icon className={styles.snsBtn} icon="GITHUB" />
              </a>
              <a className={styles.btnContainer} href="https://www.reddit.com/r/slotnslot" target="_blank">
                <Icon className={styles.snsBtn} icon="REDDIT" />
              </a>
              <a className={styles.btnContainer} href="https://discord.gg/f97RkQf" target="_blank">
                <Icon className={styles.snsBtn} icon="DISCORD" />
              </a>
              <a className={styles.btnContainer} href="https://twitter.com/slotnslot" target="_blank">
                <Icon className={styles.snsBtn} icon="TWITTER" />
              </a>
              <a className={styles.btnContainer} href="https://medium.com/@kkenji1024" target="_blank">
                <Icon className={styles.snsBtn} icon="MEDIUM" />
              </a>
            </div>
          </div>
        </div>
        <CrowdSaleContainer />
      </div>
    );
  }
}
export default EmailContainer;
