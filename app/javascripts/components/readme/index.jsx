import React from 'react';
import { Link } from 'react-router-dom';
import styles from './readme.scss';

const readmeHTML = require('../../../../README.md');

function createMarkup() {
  return { __html: readmeHTML };
}

const Readme = () => {
  return (
    <div className={styles.readmeContainer}>
      <div style={{ textAlign: 'right', marginTop: 50 }}>
        <Link style={{ color: 'blue', fontSize: 20 }} to="/slot/play">
          Back to Play Page
        </Link>
      </div>
      <div className={styles.markDownContainer} dangerouslySetInnerHTML={createMarkup()} />
    </div>
  );
};

export default Readme;
