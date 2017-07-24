import Axios from 'axios';
import React from 'react';
import styles from './mailingContainer.scss';

class MailingContainer extends React.PureComponent {
  async subscribeEmail(e) {
    e.preventDefault();
    const emailInput = this.emailInput.value;
    console.log(emailInput);
    // e-mail validation by regular expression
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reg.test(emailInput)) {
      alert('Please input valid e-mail');
    } else {
      try {
        await Axios.post(`https://uabahwzd5e.execute-api.us-east-1.amazonaws.com/prod/subscribeMailingList?email=${emailInput}`);
        alert('You are on the subscribe list now');
        this.emailInput.value = '';
      } catch (err) {
        alert(`Failed: ${err.response.data.error}`);
      }
    }
  }
  render() {
    return (
      <div className={styles.mailingContainer}>
        <div className={styles.innerContainer}>
          <div className={styles.mailingTitle}> Subscribe to our mailing and follow up recent updates.</div>
          <div className={styles.mailingSubTitle}>
            We will send you important information<br /> such as ICO start notifications or game releases by email.
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
        </div>
      </div>
    );
  }
}
export default MailingContainer;
