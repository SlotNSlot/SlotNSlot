import React from 'react';
const InlineSVG = require('svg-inline-react');

const ICONS = {
  TIP_BUBBLE: require('./tipBubble.svg'),
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
  HIPCHAT_FOR_FOOTER: require('./hipchat-for-footer.svg'),
  HIPCHAT: require('./hipchat.svg'),
  TWITTER_FOR_FOOTER: require('./twitter-for-footer.svg'),
  TWITTER: require('./twitter.svg'),
  SLOT_N_SLOT_LOGO_NON_SHADOW: require('./slot-n-slot-logo-non-shadow.svg'),
  SLOT_N_SLOT_LOGO: require('./slot-n-slot-logo.svg'),
  SUBSCRIBE_BUTTON: require('./subscribe-button.svg'),
  TRIANGLE_DOWN: require('./triangle-down.svg'),
  TRIANGLE_RIGHT: require('./triangle-right.svg'),
  MAKE_SLOT: require('./make-slot.svg'),
  CROWDSALE_TICKET: require('./crowdsale-ticket.svg'),
  MEDIUM: require('./medium.svg'),
  MEDIUM_FOR_FOOTER: require('./medium-for-footer.svg'),
  BLACK_DOT: require('./blackDot.svg'),
  COMBINED_SHAPE: require('./combined-shape.svg'),
  COMBINED_SHAPE_FILL: require('./combined-shape-2.svg'),
  SLOT_PLUS_BUTTON: require('./slot-plus-button.svg'),
  PLAY_BUTTON: require('./play-button.svg'),
  SLOT_COIN: require('./slot-coin.svg'),
  FACEBOOK: require('./facebook.svg'),
  FACEBOOK_FOR_FOOTER: require('./facebook-for-footer.svg'),
  DISCORD: require('./discord.svg'),
  DISCORD_FOR_FOOTER: require('./discord-for-footer.svg'),
  TELEGRAM: require('./telegram.svg'),
  TELEGRAM_FOR_FOOTER: require('./telegram-for-footer.svg'),
  DEPOSIT_TOOL_TIP: require('./deposit-tool-tip.svg'),
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
