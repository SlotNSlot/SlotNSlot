import React from 'react';

const ADWORDS_CONTAINER_ID = 'ADWORDS_CONTAINER_ID';
const GOOGLE_CONVERSION_ID = 842143306;
const GOOGLE_CONVERSION_LABEL = '5LeFCKuz1nMQyqzIkQM';
const GOOGLE_REMARKETING_ONLY = false;

export default class AdWords extends React.PureComponent {
  componentDidMount() {
    const scriptNode = document.createElement('script');
    scriptNode.src = '//www.googleadservices.com/pagead/conversion_async.js';

    const adDiv = document.querySelector(`#${ADWORDS_CONTAINER_ID}`);
    if (adDiv) {
      adDiv.appendChild(scriptNode);
    }

    window.goog_snippet_vars = function() {
      const w = window;
      w.google_conversion_id = GOOGLE_CONVERSION_ID;
      w.google_conversion_label = GOOGLE_CONVERSION_LABEL;
      w.google_remarketing_only = GOOGLE_REMARKETING_ONLY;
    };
    // DO NOT CHANGE THE CODE BELOW.
    window.goog_report_conversion = function(url) {
      goog_snippet_vars();
      window.google_conversion_format = '3';
      const opt = new Object();
      opt.onload_callback = function() {
        if (typeof url !== 'undefined') {
          window.location = url;
        }
      };
      const conv_handler = window.google_trackConversion;
      if (typeof conv_handler === 'function') {
        conv_handler(opt);
      }
    };
  }

  render() {
    return <div id={ADWORDS_CONTAINER_ID} />;
  }
}
