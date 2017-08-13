import React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Prompt } from 'react-router-dom';
import SlotGame from './game';
import * as Actions from './actions';
import Web3Service from '../../helpers/web3Service';
import styles from './playSlot.scss';
import './react-table.scss';
import { USER_TYPES } from '../slotList/actions';
import Icon from '../../icons';
import Toast from '../../helpers/notieHelper';

let gameAlreadyLoaded = false;
let slotMachineLoaded = false;

function mapStateToProps(appState) {
  return {
    root: appState.root,
    playSlotState: appState.playSlot,
  };
}

class PlaySlot extends React.PureComponent {
  constructor(props) {
    super(props);

    this.slotAddress = this.props.match.params.slotAddress;

    this.setDeposit = this.setDeposit.bind(this);
    this.cashOutSlotMachine = this.cashOutSlotMachine.bind(this);
    this.getReactTable = this.getReactTable.bind(this);
    this.getLoadingBlocker = this.getLoadingBlocker.bind(this);
    this.getDepositTipLabel = this.getDepositTipLabel.bind(this);
    this.setBetSize = this.setBetSize.bind(this);
    this.setLineNum = this.setLineNum.bind(this);
    this.playGame = this.playGame.bind(this);
  }

  componentDidMount() {
    const { root, playSlotState } = this.props;

    window.scrollTo(0, 0);

    if (!this.canvas || gameAlreadyLoaded) {
      return;
    }

    Web3Service.createGenesisRandomNumber(this.slotAddress, USER_TYPES.PLAYER);

    gameAlreadyLoaded = true;

    if (root.get('account') !== null && !slotMachineLoaded) {
      this.getSlotMachine(this.slotAddress, root.get('account'));
      this.setPlayerKickedByWatcher(this.slotAddress, root.get('account'));
      slotMachineLoaded = true;
    }

    this.slotGame = new SlotGame({
      canvas: this.canvas,
      isLoading: playSlotState.get('isLoading'),
      hasError: playSlotState.get('hasError'),
      lineNum: playSlotState.get('lineNum'),
      betSize: playSlotState.get('betSize'),
      betUnit: playSlotState.get('betUnit'),
      minBet: playSlotState.get('minBet'),
      maxBet: playSlotState.get('maxBet'),
      bankRoll: playSlotState.get('bankRoll'),
      yourStake: playSlotState.get('deposit'),
      slotName: playSlotState.get('slotName'),
      setBetSize: this.setBetSize,
      setLineNum: this.setLineNum,
      playGame: this.playGame,
    });
  }

  componentDidUpdate(prevProps) {
    const { root, playSlotState } = prevProps;

    if (this.props.playSlotState !== playSlotState || this.props.root !== root) {
      this.updateGameInformation();

      if (playSlotState.get('hasError')) {
        this.slotGame.errorOccur();
      }

      if (root.get('account') !== null && !slotMachineLoaded) {
        this.getSlotMachine(this.slotAddress, root.get('account'));
        this.setPlayerKickedByWatcher(this.slotAddress, root.get('account'));

        slotMachineLoaded = true;
      }
    }
  }

  componentWillUnmount() {
    if (this.slotGame) {
      this.cashOutSlotMachine();
      this.slotGame.removeCurrentGame();
      gameAlreadyLoaded = false;
      slotMachineLoaded = false;
    }
  }

  render() {
    const { playSlotState } = this.props;

    return (
      <div className={styles.playSlotSection}>
        <Prompt
          message={() =>
            'Do you really want to leave this slot? When you leave, your balance in the current slot is automatically cashed out to your wallet'}
        />
        <div className={styles.playSlotContainer}>
          <div className={styles.innerHeader}>
            <div className={styles.slotName}>
              ✨{playSlotState.get('slotName')}✨
            </div>
            <div className={styles.rightBtns}>
              <button
                title="Go to Etherscan"
                className={styles.helpBtn}
                onClick={() => {
                  window.open(`https://rinkeby.etherscan.io/address/${this.slotAddress}`, '_blank');
                }}
              >
                ?
              </button>
              <button onClick={this.setDeposit} className={`${styles.depositBtn} ${styles.headerBtn}`}>
                DEPOSIT
                {this.getDepositTipLabel()}
              </button>
              <button onClick={this.cashOutSlotMachine} className={styles.headerBtn}>
                CASH OUT
              </button>
            </div>
          </div>
          <div className={styles.gameContainer}>
            <canvas
              ref={canvas => {
                this.canvas = canvas;
              }}
            />
            {this.getLoadingBlocker()}
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.bottomContainer}>
            <div className={`${styles.sectionMenu} ${styles.active}`}>YOUR BETS</div>
          </div>
          {this.getReactTable()}
        </div>
      </div>
    );
  }

  updateGameInformation() {
    const { playSlotState } = this.props;

    this.slotGame.updateGameInformation({
      isLoading: playSlotState.get('isLoading'),
      lineNum: playSlotState.get('lineNum'),
      betSize: playSlotState.get('betSize'),
      betUnit: playSlotState.get('betUnit'),
      maxBet: playSlotState.get('maxBet'),
      minBet: playSlotState.get('minBet'),
      hasError: playSlotState.get('hasError'),
      bankRoll: playSlotState.get('bankRoll'),
      yourStake: playSlotState.get('deposit'),
      slotName: playSlotState.get('slotName'),
    });
  }

  getDepositTipLabel() {
    const { playSlotState } = this.props;

    if (playSlotState.get('isLoading') || !playSlotState.get('isOccupied')) {
      return (
        <div className={styles.depositTip}>
          <Icon icon="DEPOSIT_TOOL_TIP" />
          <span className={styles.tipMessage}>
            {playSlotState.get('waitOccupy') ? 'Wait deposit...' : 'Please deposit first!'}
          </span>
        </div>
      );
    } else {
      return null;
    }
  }

  getLoadingBlocker() {
    const { playSlotState } = this.props;

    if (playSlotState.get('isLoading') || !playSlotState.get('isOccupied')) {
      return <div className={styles.loadingBlocker} />;
    } else {
      return null;
    }
  }

  getReactTable() {
    const { playSlotState } = this.props;
    const betsData = playSlotState.get('betsData').toJS();

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
        getProps(state, rowInfo) {
          if (rowInfo !== undefined) {
            if (parseFloat(rowInfo.row.profit) >= 0) {
              rowInfo.row.profit = `+${rowInfo.row.profit}`;
            } else {
              rowInfo.row.profit = `-${rowInfo.row.profit}`;
            }
          }

          return {};
        },
        Header: 'PROFIT',
        accessor: 'profit',
      },
    ];

    return (
      <div className={styles.tableWrapper}>
        <ReactTable className="" data={betsData} columns={columns} defaultPageSize={10} showPageSizeOptions={false} />
      </div>
    );
  }

  setDeposit() {
    const { dispatch, root, playSlotState } = this.props;

    Toast.notie.input({
      text: 'Please write down the amount of ETH to put in this slot.',
      type: 'number',
      submitCallback: ethValue => {
        if (root.get('balance') < Number(ethValue)) {
          Toast.notie.alert({
            type: 'error',
            text: 'Your bet amount should be under your balance',
          });
          return;
        }

        const ethValueBigNumber = Web3Service.getWeb3().toBigNumber(ethValue);
        const weiValue = Web3Service.makeWeiFromEther(parseFloat(ethValue, 10));
        const slotMachineContract = playSlotState.get('slotMachineContract');

        if (playSlotState.get('isOccupied')) {
          dispatch(Actions.sendEtherToSlotContract(slotMachineContract, root.get('account'), weiValue));
        } else {
          dispatch(Actions.occupySlotMachine(slotMachineContract, root.get('account'), weiValue));
          dispatch(Actions.setDeposit(ethValueBigNumber));
          dispatch(Actions.setWaitOccupy(true));
        }
      },
    });
  }

  setPlayerKickedByWatcher(slotMachineContractAddress, playerAddress) {
    const { dispatch } = this.props;
    dispatch(Actions.setPlayerKickedByWatcher(slotMachineContractAddress, playerAddress));
  }

  setBetSize(betSize) {
    const { dispatch } = this.props;
    dispatch(Actions.setBetSize(betSize));
  }

  setLineNum(lineNum) {
    const { dispatch } = this.props;
    dispatch(Actions.setLineNum(lineNum));
  }

  playGame() {
    const { dispatch, root, playSlotState } = this.props;

    const gameInfo = {
      slotMachineContract: playSlotState.get('slotMachineContract'),
      playerAddress: root.get('account'),
      betSize: playSlotState.get('betSize'),
      lineNum: playSlotState.get('lineNum'),
    };

    dispatch(Actions.requestToPlayGame(gameInfo, this.slotGame.stopSpin));
  }

  getSlotMachine(slotAddress, playerAddress) {
    const { dispatch } = this.props;

    dispatch(Actions.getSlotMachine(slotAddress, playerAddress));
  }

  cashOutSlotMachine() {
    const { dispatch, root, playSlotState } = this.props;

    if (playSlotState.get('isOccupied')) {
      dispatch(Actions.cashOutSlotMachine(playSlotState.get('slotMachineContract'), root.get('account')));
    }
  }
}

export default connect(mapStateToProps)(PlaySlot);
