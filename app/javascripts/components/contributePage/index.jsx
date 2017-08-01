import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import styles from './contributePage.scss';
import { Header, Footer } from './layouts';
import WelcomeContainer from './welcomeContainer';
import DetailContainer from './detailContainer';

const ContributePage = () =>
  <div className={styles.contributeComponent}>
    <Header />
    <WelcomeContainer />
    <DetailContainer />
    <Footer />
  </div>;

export default withRouter(ContributePage);
