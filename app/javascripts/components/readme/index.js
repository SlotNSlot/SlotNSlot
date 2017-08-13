import React from 'react';
import { Link } from 'react-router-dom';
const readmeHTML = require('../../../../README.md');

function createMarkup() {
  return { __html: readmeHTML };
}

const Readme = () => {
  return (
    <div className="container">
      <div style={{ textAlign: 'right', marginTop: 50 }}>
        <Link style={{ color: 'blue', fontSize: 20 }} to="/slot/play">
          Back to Play Page
        </Link>
      </div>
      <div dangerouslySetInnerHTML={createMarkup()} />
    </div>
  );
};

export default Readme;
