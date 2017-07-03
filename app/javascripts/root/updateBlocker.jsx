import React from 'react';

export default class UpdateBlocker extends React.PureComponent {
  shouldComponentUpdate(nextProps) {
    return this.props.location !== nextProps.location;
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
