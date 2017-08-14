import React from 'react';
import styles from './detailSection.scss';
import Icon from '../../../../icons';

class DetailSection extends React.PureComponent {
  render() {
    return (
      <div className={styles.modalContainer}>
        <button className={styles.closeBtn} onClick={this.props.handleClose}>
          <Icon icon="CANCEL" />
        </button>

        <div className={styles.title}>Crowdsale Detail</div>

        <div className={styles.warningMsg}>
          <span className={styles.bold}>SlotNSlot Crowdsale</span> is not started yet. The crowdsale will{' '}
          <span className={styles.bold}>start at August 20th, 2017</span>.
        </div>
        {/* <div className={styles.warningMsg}>
          WARNING: <span className={styles.bold}>Do NOT attempt to transfer</span> Ether(ETH) from wallets controlled by
          any type of <span className={styles.bold}>currency exchange</span>.
        </div> */}

        <div className={styles.smallTitle}>Crowdsale Address</div>
        <input
          className={styles.contributeAddress}
          ref={ref => (this.addressInput = ref)}
          type="text"
          value="TBD"
          readOnly
        />
        <button
          onClick={() => {
            this.addressInput.select();
            document.execCommand('copy');
          }}
          className={styles.copyBtn}
        >
          Copy
        </button>

        <div className={styles.smallTitle}>Price</div>
        <div className={styles.priceDetail}>
          1) <span className={styles.bold}>12,000 SLOT</span> / ETH : 20% bonus for the first 24 hours <br />
          2) <span className={styles.bold}>10,000 SLOT</span> / ETH : after 24 hours until the end of crowdsale
        </div>

        <div className={styles.smallTitle}>Hard Cap</div>
        <div className={styles.hardcapAmount}>40,000 ETH</div>
        <div className={styles.hardcapDetail}>
          * The Smart Contract System Code for the creation of SLOT is implemented in such way that any remaining fund
          at suspension of the project will be sent to the addresses of Ethereum accounts holding SLOT, proportional to
          the amount held.
        </div>

        <div className={styles.moreInformation}>
          <div className={styles.question}>Do you have any further questions?</div>
          <a
            href="https://keepingstock.net/better-ico-investors-must-be-protected-84b760fda5f0"
            target="_blank"
            className={styles.blogLink}
          >
            Check our blog post
          </a>
          or
          <a href="https://discord.gg/f97RkQf" target="_blank" className={styles.discordLink}>
            Join discord chat
          </a>
        </div>
        <div className={styles.buttonWrapper}>
          <button onClick={this.props.handleClose} className={styles.confirmBtn}>
            CONFIRM
          </button>
        </div>
      </div>
    );
  }
}

export default DetailSection;
