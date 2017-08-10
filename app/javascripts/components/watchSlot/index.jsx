import React from 'react';
import { connect } from 'react-redux';
import Toast from '../../helpers/notieHelper';
import Web3Service from '../../helpers/web3Service';
// components
import SlotGame from '../playSlot/game';
// actions
import * as Actions from './actions';
// styles
import styles from './watchSlot.scss';

let gameAlreadyLoaded = false;
let slotMachineLoaded = false;

function mapStateToProps(appState) {
  return {
    root: appState.root,
    watchSlotState: appState.watchSlot,
  };
}

class WatchSlot extends React.PureComponent {
  constructor(props) {
    super(props);

    this.slotAddress = this.props.match.params.slotAddress;

    // Bind instance methods
    this.removeSlotMachine = this.removeSlotMachine.bind(this);
    this.handleWeb3Events = this.handleWeb3Events.bind(this);
    this.stopEnd = this.stopEnd.bind(this);
    this.checkInitQueue = this.checkInitQueue.bind(this);
    this.shiftInitEvent = this.shiftInitEvent.bind(this);
    this.checkConfirmQueue = this.checkConfirmQueue.bind(this);
    this.shiftConfirmEvent = this.shiftConfirmEvent.bind(this);
    this.kickPlayer = this.kickPlayer.bind(this);

    // Attach event watcher
    this.attachEventWatcher(this.slotAddress, this.handleWeb3Events);
  }

  componentDidMount() {
    if (!this.canvas || gameAlreadyLoaded) {
      return;
    }
    const { root, watchSlotState } = this.props;

    gameAlreadyLoaded = true;
    if (root.get('account') !== null && !slotMachineLoaded) {
      this.getSlotMachine(this.slotAddress, root.get('account'));
      slotMachineLoaded = true;
    }

    this.slotGame = new SlotGame({
      canvas: this.canvas,
      isLoading: watchSlotState.get('isLoading'),
      hasError: watchSlotState.get('hasError'),
      lineNum: watchSlotState.get('lineNum'),
      betSize: watchSlotState.get('betSize'),
      betUnit: watchSlotState.get('betUnit'),
      minBet: watchSlotState.get('minBet'),
      maxBet: watchSlotState.get('maxBet'),
      bankRoll: watchSlotState.get('bankRoll'),
      yourStake: watchSlotState.get('deposit'),
      slotName: watchSlotState.get('slotName'),
      checkInitQueue: this.checkInitQueue,
      shiftInitEvent: this.shiftInitEvent,
      checkConfirmQueue: this.checkConfirmQueue,
      shiftConfirmEvent: this.shiftConfirmEvent,
      stopEnd: this.stopEnd,
      isWatcherPage: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { root, watchSlotState } = nextProps;

    if (this.props.watchSlotState !== watchSlotState || this.props.root !== root) {
      this.slotGame.isLoading = watchSlotState.get('isLoading');
      this.slotGame.lineNum = watchSlotState.get('lineNum');
      this.slotGame.betSize = watchSlotState.get('betSize');
      this.slotGame.betUnit = watchSlotState.get('betUnit');
      this.slotGame.maxBet = watchSlotState.get('maxBet');
      this.slotGame.minBet = watchSlotState.get('minBet');
      this.slotGame.hasError = watchSlotState.get('hasError');
      this.slotGame.bankRoll = watchSlotState.get('bankRoll');
      this.slotGame.yourStake = watchSlotState.get('deposit');
      this.slotGame.slotName = watchSlotState.get('slotName');

      if (watchSlotState.get('hasError')) {
        this.slotGame.errorOccur();
      }

      if (root.get('account') !== null && !slotMachineLoaded) {
        this.getSlotMachine(this.slotAddress);
        if (this.props.slotList === undefined) {
          this.getMySlotMachines(root.get('account'));
        }
        slotMachineLoaded = true;
      }
    }
  }

  componentWillUnmount() {
    if (this.slotGame) {
      this.slotGame.removeCurrentGame();
      gameAlreadyLoaded = false;
      slotMachineLoaded = false;
    }
  }

  render() {
    const { watchSlotState } = this.props;

    return (
      <div className={styles.watchSlotSection}>
        <div className={styles.watchSlotContainer}>
          <div className={styles.innerHeader}>
            <div className={styles.slotName}>
              ✨{watchSlotState.get('slotName')}✨
            </div>
            <div className={styles.rightBtns}>
              <button
                className={styles.helpBtn}
                onClick={() => {
                  alert('help');
                }}
              >
                ?
              </button>
              <button onClick={this.kickPlayer} className={styles.headerBtn}>
                KICK
              </button>
              <button onClick={this.removeSlotMachine} className={styles.headerBtn}>
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
          </div>
        </div>
        <div className={styles.bottomSection} />
      </div>
    );
  }

  kickPlayer() {
    const { dispatch, watchSlotState, root } = this.props;
    const playerAddress = watchSlotState.get('playerAddress');
    const bankerAddress = root.get('account');

    if (playerAddress !== '') {
      Toast.notie.confirm({
        text: 'Do you really want to kick player?',
        submitCallback: () => {
          dispatch(Actions.kickPlayer(this.slotAddress, bankerAddress));
        },
      });
    } else {
      Toast.notie.alert({
        type: 'error',
        text: 'Player does not exist.',
      });
    }
  }

  getSlotMachine(slotAddress) {
    const { dispatch } = this.props;

    dispatch(Actions.getSlotMachine(slotAddress));
  }

  removeSlotMachine() {
    const { dispatch, root, watchSlotState } = this.props;

    dispatch(Actions.removeSlotMachine(watchSlotState.get('slotMachineContract').address, root.get('account')));
  }

  checkInitQueue() {
    const { watchSlotState } = this.props;
    return watchSlotState.get('initQueue').length > 0;
  }

  shiftInitEvent() {
    const { watchSlotState, dispatch } = this.props;

    const gameInfo = watchSlotState.get('initQueue')[0];
    dispatch(Actions.shiftInitEvent());
    return gameInfo;
  }

  checkConfirmQueue() {
    const { watchSlotState } = this.props;
    const confirmQueue = watchSlotState.get('confirmQueue');
    const nowChainIndex = watchSlotState.get('chainIndex');
    confirmQueue.forEach((gameResult, index) => {
      if (gameResult.chainIndex === nowChainIndex) {
        return index;
      }
    });
    return false;
  }

  shiftConfirmEvent(queueIndex) {
    const { dispatch, watchSlotState } = this.props;

    const gameResult = watchSlotState.get('confirmQueue')[queueIndex];
    this.slotGame.stopSpin(gameResult.winMoney);
    dispatch(Actions.stopStart(gameResult));
    dispatch(Actions.shiftConfirmEvent(queueIndex));
  }

  attachEventWatcher(slotAddress, handleWeb3EventsFunc) {
    const { dispatch } = this.props;

    dispatch(Actions.attachEventWatcher(slotAddress, handleWeb3EventsFunc));
  }

  getMySlotMachines(playerAddress) {
    const { dispatch } = this.props;

    dispatch(Actions.getMySlotMachines(playerAddress));
  }
  stopEnd() {
    const { dispatch, watchSlotState } = this.props;
    console.log('stopEdn Function!!');
    dispatch(Actions.stopEnd());
    if (watchSlotState.get('initQueue').size > 0) {
    }
  }
  handleWeb3Events(eventName, result) {
    const { dispatch, watchSlotState, root } = this.props;
    console.log(`${eventName} handleWeb3Events is`, result);
    switch (eventName) {
      case 'gameOccupied':
        if (!watchSlotState.get('isOccupied')) {
          Toast.notie.alert({
            text: 'Your SlotMachine is occupied.',
          });
          const inputEther = Web3Service.makeEthFromWei(result.value);
          const playerAddress = result.from;
          dispatch(Actions.setDeposit(inputEther));
          dispatch(Actions.setPlayerAddress(playerAddress));
        }
        break;
      // animationStatus
      // 0(stopped), 1(spinning), 2(going to stopped)
      case 'gameInitialized':
        const initEventData = result.data.substr(2);
        const betSize = Web3Service.makeEthFromWei(parseInt(initEventData.substr(64, 64), 16));
        const lineNum = parseInt(initEventData.substr(128, 64), 16);
        const chainIndex = parseInt(initEventData.substr(64 * 3, 64), 16);
        const gameInfo = {
          betSize,
          lineNum,
          chainIndex,
        };
        if (watchSlotState.get('animationStatus') === 0) {
          dispatch(Actions.spinStart(gameInfo));
          this.slotGame.startSpin();
        } else {
          dispatch(Actions.pushInitEvent(gameInfo));
        }
        break;

      case 'gameConfirmed':
        const confirmEventData = result.data.substr(2);
        const resultChainIndex = parseInt(confirmEventData.substr(64, 64), 16);
        const winMoney = Web3Service.makeEthFromWei(parseInt(confirmEventData.substr(0, 64), 16));
        const gameResult = {
          winMoney,
          chainIndex: resultChainIndex,
        };
        if (watchSlotState.get('animationStatus') === 1 && watchSlotState.get('chainIndex') === resultChainIndex) {
          dispatch(Actions.stopStart(gameResult));
          this.slotGame.stopSpin(winMoney);
        } else {
          dispatch(Actions.pushConfirmEvent(gameResult));
        }
        break;

      case 'playerLeft':
        break;

      default:
        break;
    }
  }
}

export default connect(mapStateToProps)(WatchSlot);
