import React from 'react';
import { connect } from 'react-redux';
import SlotGame from './game';
import * as Actions from './actions';

let gameAlreadyLoaded = false;

function mapStateToProps(appState) {
  return {
    root: appState.root,
    playSlotState: appState.playSlot,
  };
}

class PlaySlot extends React.PureComponent {
  componentDidMount() {
    if (!this.canvas || gameAlreadyLoaded) {
      return;
    }
    const { root, playSlotState } = this.props;
    gameAlreadyLoaded = true;
    this.slotGame = new SlotGame({
      canvas: this.canvas,
      betSize: playSlotState.get('betSize'),
      lineNum: playSlotState.get('lineNum'),
      bankRoll: playSlotState.get('bankRoll'),
      betUnit: playSlotState.get('betUnit'),
      minBet: playSlotState.get('minBet'),
      maxBet: playSlotState.get('maxBet'),
      setBetSize: this.setBetSize.bind(this),
      setLineNum: this.setLineNum.bind(this),
      spinStart: this.spinStart.bind(this),
      yourStake: root.get('balance'),
    });
  }
  shouldComponentUpdate(nextProps) {
    const { root, playSlotState } = nextProps;
    this.slotGame.betSize = playSlotState.get('betSize');
    this.slotGame.lineNum = playSlotState.get('lineNum');
    this.slotGame.bankRoll = playSlotState.get('bankRoll');
    this.slotGame.yourStake = root.get('balance');
    return true;
  }
  componentWillUnmount() {
    if (this.slotGame) {
      this.slotGame.removeCurrentGame();
      gameAlreadyLoaded = false;
    }
  }

  render() {
    return (
      <div>
        <div>
          My Balance <span id="your-balance">{root.get('balance')}</span>
        </div>
        <canvas
          ref={canvas => {
            this.canvas = canvas;
          }}
        />
      </div>
    );
  }

  setBetSize(betSize) {
    const { dispatch } = this.props;
    dispatch(Actions.setBetSize(betSize));
  }

  setLineNum(lineNum) {
    const { dispatch } = this.props;
    dispatch(Actions.setLineNum(lineNum));
  }

  spinStart() {
    const { dispatch } = this.props;
    dispatch(Actions.spinStart());
  }
}

export default connect(mapStateToProps)(PlaySlot);
