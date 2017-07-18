import React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import './react-table.scss';
import SlotGame from './game';
import * as Actions from './actions';
import styles from './playSlot.scss';
import EmotionButton from './emotionButton';

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
    const { root, playSlotState } = this.props;
    const _data = playSlotState.get('betsData').toJS();
    const tableCategory = playSlotState.get('tableCategory');

    const columns = [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'TIME',
        accessor: 'time',
      },
      {
        Header: 'BET',
        accessor: 'bet',
      },
      {
        Header: 'RESULT',
        accessor: 'result',
      },
      {
        Header: 'PROFIT',
        accessor: 'profit',
      },
    ];

    return (
      <div className={styles.playSlotSection}>
        <div className={styles.playSlotContainer}>
          <div className={styles.innerHeader}>
            <div className={styles.slotName}>Slot Name</div>
            <div className={styles.rightBtns}>
              <button
                className={styles.helpBtn}
                onClick={() => {
                  alert('help');
                }}
              >
                ?
              </button>
              <button
                onClick={() => {
                  alert('deposit');
                }}
                className={styles.headerBtn}
              >
                DEPOSIT
              </button>
              <button
                onClick={() => {
                  alert('cash out');
                }}
                className={styles.headerBtn}
              >
                CASH OUT
              </button>
            </div>
          </div>
          <canvas
            ref={canvas => {
              this.canvas = canvas;
            }}
          />
        </div>
        <EmotionButton />
        <div className={styles.bottomSection}>
          <div className={styles.bottomContainer}>
            <div
              onClick={() => {
                this.props.dispatch(Actions.setCategory(0));
              }}
              className={`${styles.sectionMenu} ${tableCategory === 0 ? styles.active : ''}`}
            >
              YOUR BETS
            </div>
            <div
              onClick={() => {
                this.props.dispatch(Actions.setCategory(1));
              }}
              className={`${styles.sectionMenu} ${tableCategory === 1 ? styles.active : ''}`}
            >
              ALL BETS
            </div>
          </div>
          <div className={styles.tableWrapper}>
            <ReactTable
              className=""
              data={_data.filter(e => {
                return tableCategory === 0 ? e.id === 1 : 1;
              })}
              columns={columns}
              defaultPageSize={10}
              showPageSizeOptions={false}
            />
          </div>
        </div>
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
