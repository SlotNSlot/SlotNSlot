import React from 'react';
import * as PIXI from 'pixi.js';
import { connect } from 'react-redux';
import SlotGame from './game';

let gameAlreadyLoaded = false;

function mapStateToProps(appState) {
  return {
    root: appState.root,
  };
}

class PlaySlot extends React.PureComponent {
  componentDidMount() {
    if (!this.canvas || gameAlreadyLoaded) {
      return;
    }

    gameAlreadyLoaded = true;

    this.slotGame = new SlotGame(this.canvas);
  }

  componentWillUnmount() {
    if (this.slotGame) {
      this.slotGame.removeCurrentGame();
      gameAlreadyLoaded = false;
    }
  }

  render() {
    const { root } = this.props;

    return (
      <div>
        <div>
          My Balance {root.get('balance')}
        </div>
        <canvas
          ref={canvas => {
            this.canvas = canvas;
          }}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(PlaySlot);
