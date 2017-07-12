import React from 'react';
import styles from './about.scss';
import EmailContainer from './emailContainer/emailContainer';
import FeatureContainer from './featureContainer/featureContainer';
import MakeAndPlayContainer from './makeAndPlayContainer/makeAndPlayContainer';
import RoadmapContainer from './roadmapContainer/roadmapContainer';
import SliderContainer from './sliderContainer/sliderContainer';
import CrowdSaleContainer from './crowdSaleContainer/crowdSaleContainer';
import MailingContainer from './mailingContainer/mailingContainer';
import { Header, Footer } from './layouts';
import Status404 from '../404';

const About = props => {
  const path = props.location.pathname;
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
      <Header />
      <EmailContainer />
      <MakeAndPlayContainer />
      <FeatureContainer />
      <RoadmapContainer />
      <SliderContainer />
      <CrowdSaleContainer />
      <MailingContainer />
      <Footer />
    </div>
  );
};

export default About;
