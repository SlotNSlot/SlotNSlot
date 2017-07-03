import React from 'react';
const InlineSVG = require('svg-inline-react');

const ICONS = {
  BROWSER: require('./browser.svg'),
  BUBBLE_LEFT: require('./bubble-left.svg'),
  BUBBLE_RIGHT: require('./bubble-right.svg'),
  EVENT_BUBBLE_DOWN: require('./event-bubble-down.svg'),
  EVENT_BUBBLE_UP: require('./event-bubble-up.svg'),
  GITHUB_FOR_FOOTER: require('./github-for-footer.svg'),
  GITHUB: require('./github.svg'),
  MOUSE_ICON: require('./mouse-icon.svg'),
  OVAL: require('./oval.svg'),
  PATH_12: require('./path-12.svg'),
  RECTANGLE_6: require('./rectangle-6.svg'),
  REDDIT_FOR_FOOTER: require('./reddit-for-footer.svg'),
  REDDIT: require('./reddit.svg'),
  S_8_FRAME: require('./s-8-frame.svg'),
  SLACK_FOR_FOOTER: require('./slack-for-footer.svg'),
  SLACK: require('./slack.svg'),
  SLOT_N_SLOT_LOGO_NON_SHADOW: require('./slot-n-slot-logo-non-shadow.svg'),
  SLOT_N_SLOT_LOGO: require('./slot-n-slot-logo.svg'),
  SUBSCRIBE_BUTTON: require('./subscribe-button.svg'),
  '404_IMAGE': require('./404-image.svg'),
};

class Icon extends React.PureComponent {
  render() {
    let className = 'icon';
    if (this.props.className) {
      className += ` ${this.props.className}`;
    }

    return <InlineSVG className={className} src={ICONS[this.props.icon]} />;
  }
}

export default Icon;
