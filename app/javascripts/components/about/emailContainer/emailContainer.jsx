import React from 'react';
import Axios from 'axios';
import styles from './emailContainer.scss';
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
              Make <span>your own Slots</span>! Play others and ruin them!
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
              <a className={styles.btnContainer} href="https://github.com/SlotNSlot/SlotNSlot" target="_blank">
                <Icon className={styles.snsBtn} icon="GITHUB" />
              </a>
              <a
                className={styles.btnContainer}
                href="https://www.reddit.com/r/ethereum/comments/6m6eu0/slotnslot_make_and_play_slots_on_ethereum_needs/?st=j4wgacux&sh=9bfabdf4"
                target="_blank"
              >
                <Icon className={styles.snsBtn} icon="REDDIT" />
              </a>
              <a className={styles.btnContainer} href="https://www.hipchat.com/gIUbFZBvh" target="_blank">
                <Icon className={styles.snsBtn} icon="HIPCHAT" />
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
      </div>
    );
  }
}
export default EmailContainer;
