import React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import './react-table.scss';
import SlotGame from './game';
import * as Actions from './actions';
import styles from './playSlot.scss';

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
    const { root } = this.props;
    const data = [
      {
        id: 1,
        time: '17.07.07',
        bet: 2300,
        result: 'success',
        profit: 100,
      },
      {
        id: 2,
        time: '17.07.07',
        bet: 2400,
        result: 'success',
        profit: -100,
      },
      {
        id: 3,
        time: '17.07.07',
        bet: 2000,
        result: 'success',
        profit: -1100,
      },
    ];
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
          {/* <div>
            My Balance <span id="your-balance">{root.get('balance')}</span>
          </div>*/}
          <div className={styles.innerHeader}>
            <div className={styles.slotName}>Slot Name</div>
            <div className={styles.rightBtns}>
              <a
                className={styles.helpBtn}
                onClick={() => {
                  alert('help');
                }}
              >
                ?
              </a>
              <a
                onClick={() => {
                  alert('deposit');
                }}
                className={styles.headerBtn}
              >
                DEPOSIT
              </a>
              <a
                onClick={() => {
                  alert('cash out');
                }}
                className={styles.headerBtn}
              >
                CASH OUT
              </a>
            </div>
          </div>
          <canvas
            ref={canvas => {
              this.canvas = canvas;
            }}
          />
        </div>
        <div className={styles.bottomSection}>
          <div className={styles.bottomContainer}>
            <div className={`${styles.sectionMenu} ${styles.active}`}>YOUR BETS</div>
            <div className={styles.sectionMenu}>ALL BETS</div>
          </div>
          <div className={styles.tableWrapper}>
            <ReactTable className="" data={data} columns={columns} defaultPageSize={10} showPageSizeOptions={false} />
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
