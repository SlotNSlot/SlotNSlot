import React from 'react';

const ADWORDS_CONTAINER_ID = 'ADWORDS_CONTAINER_ID';

export default class AdWords extends React.PureComponent {
  componentDidMount() {
    const scriptNode = document.createElement('script');
    scriptNode.src = '//www.googleadservices.com/pagead/conversion_async.js';

    const adDiv = document.querySelector(`#${ADWORDS_CONTAINER_ID}`);

    if (adDiv) {
      adDiv.appendChild(scriptNode);
    }
  }

  render() {
    return <div id={ADWORDS_CONTAINER_ID} />;
  }
}
