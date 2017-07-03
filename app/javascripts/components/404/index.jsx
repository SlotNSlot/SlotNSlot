import React from 'react';
import { Link } from 'react-router-dom';
import styles from './status404.scss';
import Icon from '../../icons';

const Status404 = () =>
  <div className={styles.container}>
    <div className={styles.innerContainer}>
      <div className={styles.image}>
        <Icon icon="404_IMAGE" />
      </div>
      <div className={styles.content}>The page you were looking for doesn`t exist.</div>
      <div className={styles.btnContainer}>
        <div className={styles.homeBtn}>
          <Link exact to="/" className={styles.btnContent}>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  </div>;

export default Status404;
