const GOOGLE_CONVERSION_ID = 842143306;
const GOOGLE_CONVERSION_SUBSCRIBE_LABEL = '5LeFCKuz1nMQyqzIkQM';
const GOOGLE_CONVERSION_NORMAL_LABEL = 'a3fbCODJ23MQyqzIkQM';
const GOOGLE_REMARKETING_ONLY = false;

export const AVAILABLE_ADWORDS_TYPE = {
  EMAIL_SUBSCRIBE: 'EMAIL_SUBSCRIBE',
  NORMAL_LINK_CLICK: 'NORMAL_LINK_CLICK',
};

export function handleAdwordsAction(type, targetUrl) {
  window.goog_snippet_vars = function() {
    const w = window;
    w.google_conversion_id = GOOGLE_CONVERSION_ID;
    w.google_remarketing_only = GOOGLE_REMARKETING_ONLY;

    if (type === AVAILABLE_ADWORDS_TYPE.EMAIL_SUBSCRIBE) {
      w.google_conversion_label = GOOGLE_CONVERSION_SUBSCRIBE_LABEL;
    } else {
      w.google_conversion_label = GOOGLE_CONVERSION_NORMAL_LABEL;
    }
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

  goog_report_conversion(targetUrl);
}
