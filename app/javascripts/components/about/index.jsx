import React from 'react';
import styles from './about.scss';
import EmailContainer from './emailContainer/emailContainer';
import FeatureContainer from './featureContainer/featureContainer';
import MakeAndPlayContainer from './makeAndPlayContainer/makeAndPlayContainer';
import RoadmapContainer from './roadmapContainer/roadmapContainer';
import SliderContainer from './sliderContainer/sliderContainer';
import MailingContainer from './mailingContainer/mailingContainer';
import DemoContainer from './demoContainer/demoContainer';
import { Header, Footer } from './layouts';
import Status404 from '../404';
import ReactModal from 'react-modal';
import Icon from '../../icons';

class About extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showModal: true,
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  render() {
    const path = this.props.location.pathname;
    if (path !== '/') {
      return (
        <div>
          <Header />
          <Status404 />
          <Footer />
        </div>
      );
    }

    return (
      <div className={styles.aboutComponent}>
        <Header openModal={this.handleOpenModal} />
        <EmailContainer />
        <MakeAndPlayContainer />
        <FeatureContainer />
        {/* <RoadmapContainer /> */}
        <SliderContainer />
        <DemoContainer />
        <MailingContainer />
        <Footer />

        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="ICO Abort Notice"
          bodyOpenClassName={styles.abortModalBody}
          className={styles.abortModal}
          overlayClassName={styles.abortModalOverlay}
          onRequestClose={this.handleCloseModal}
        >
          <div className={styles.modalContainer}>
            <button className={styles.closeBtn} onClick={this.handleCloseModal}>
              <Icon icon="CANCEL" />
            </button>
            <div className={styles.modalTitle}>
              <img src="https://d1qh7kd1bid312.cloudfront.net/warning.png" />
              SlotNSlot ICO Cancelled
            </div>
            <div className={styles.modalDetail}>
              <p>Good day Crypto world. This is SlotNSlot team.</p>
              <p>
                After a long meeting within the team with concerns and worries, we’ve decided to stop the crowdsale(ICO)
                planned to begin August 20th. We’re sorry to deliver such disappointing news.
              </p>
              <p>
                The team has gathered to develop DApps in South Korea. Without sufficient considerations and preparation
                in advance, we’ve been attracted to develop a slot machine platform as a major concept of the project
                since it seemed to fit well to the properties given by a DApp. Because online gamble is strictly
                prohibited in the country, anonymity was a major necessity and thus the platform needed to be
                autonomous.
              </p>
              <p>
                Along the progress of the project, we’ve believed that doing the crowdsale(ICO) is a part of validating
                the product, so we planned and progressed with the ICO in mind. However, we were not prepared with such
                detailed long term plan for the project and its use of the funds raised that investors could be
                satisfied and agree with. While designing and developing the structure of the platform, there seemed to
                be lots of difficulties and obstacles to make it fully autonomous, which made it much burdensome to stay
                anonymous. At current stage, we lack the confidence that the project can be a success, and enforcing the
                crowdsale in such conditions is an irresponsible decision. For this reason, we are retracting the
                crowdsale(ICO) for the project.
              </p>
              <p>
                The team has learned much understandings and lessons from the project, developing a DApp based on
                Ethereum, preparing and progressing an ICO, and communicating with the community. With such valuable
                experience, we’re planning a whole different DApp project, and that project will be conducted with
                sufficient preparations, without anonymity.
              </p>
              <p>
                All of our source codes for the SlotNSlot platform are accessible on our{' '}
                <a href="https://github.com/slotnslot">Github</a>, and for the time being we will run the recently
                announced Beta version on the Rinkeby testnet. If you have any inquiries about the codes or the project,
                we will happily answer to you. Please contact us via Email:{' '}
                <a href="mailto:team@slotnslot.com">team@slotnslot.com</a>
              </p>
              <p>
                We are truly thankful and honored with so much feedbacks, encouragements, and supports from the
                community. We were really happy when people came to our private communication channels to give us
                suggestions on the project. The team is feeling responsible for not being able to finish the project as
                planned, and will be preparing the next project with much diligence.
              </p>
              <p>SlotNSlot Team.</p>
            </div>
            <button className={styles.confirmBtn} onClick={this.handleCloseModal}>
              CONFIRM
            </button>
            <div className={styles.moreInfo}>
              <p>Do you have any further questions?</p>
              <a href="https://discord.gg/f97RkQf" target="_blank">
                Join discord chat
              </a>
            </div>
          </div>
        </ReactModal>
      </div>
    );
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }
}

export default About;
