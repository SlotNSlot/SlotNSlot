import * as PIXI from 'pixi.js';
import shuffle from 'lodash.shuffle';
import Big from 'big.js'; // for arbitrary-precision decimal arithmetic.
import Toast from '../../helpers/notieHelper';

const ENTIRE_REEL_COUNT = 5;
const ITEM_PER_ENTIRE_REEL = 12;
const ITEMS_PER_HALF_REEL = ITEM_PER_ENTIRE_REEL / 2;
const ALL_SYMBOL_COUNT = 9;
const SYMBOL_WIDTH = 100.4;
const SYMBOL_HEIGHT = 92.7;
const SYMBOL_WIDTH_GAP = 60;
const SYMBOL_HEIGHT_GAP = 35.7;
const SLOWING_DISTANCE = 52;
const SLOT_START_X = 97.3;

// STATE CONST VALUES
const STATE_ZERO = 0; // State which does not load every PIXI Component.
const STATE_WAITING = 1; // State which does nothing, so ready to spin
const STATE_SPINNING = 2; // State which is spinning while waiting slot result.
const STATE_STOPPING = 3; // State which is animating while stopping.
const STATE_DRAWING = 4; // State whcih is drawing slot win line
const STATE_BIG_WIN = 5; // State whcih is drawing Big Win

const PAY_TABLE = [
  [5, 10, 25], // A 0
  [5, 25, 50], // B 1
  [25, 50, 75], // C 2
  [50, 75, 100], // D 3
  [75, 125, 150], // E 4
  [100, 150, 250], // G 5
  [125, 250, 1000], // F 6
  [250, 500, 2000], // H 7
];

const PROBABILITY_TABLE = [
  9.000001082 * 10 ** -1, // not win
  6.9864 * 10 ** -2, // 5
  2.1954 * 10 ** -2, // 10
  4.7523 * 10 ** -3, // 25
  1.4933 * 10 ** -3, // 50
  7.5869 * 10 ** -4, // 75
  4.6925 * 10 ** -4, // 100
  3.2326 * 10 ** -4, // 125
  2.3841 * 10 ** -4, // 150
  1.0158 * 10 ** -4, // 250
  3.192 * 10 ** -5, // 500
  1.003 * 10 ** -5, // 1000
  3.1518 * 10 ** -6, // 2000
];
const PROBABILITY_VALUE_TABLE = [0, 5, 10, 25, 50, 75, 100, 125, 150, 250, 500, 1000, 2000];
const LINE_CASES = [
  [{ symbol: '7', length: 5 }], // 2000
  [{ symbol: '6', length: 5 }], // 1000
  [{ symbol: '7', length: 4 }], // 500
  [{ symbol: '7', length: 3 }, { symbol: '6', length: 4 }, { symbol: '5', length: 5 }], // 250
  [{ symbol: '5', length: 4 }, { symbol: '4', length: 5 }], // 150
  [{ symbol: '6', length: 3 }, { symbol: '4', length: 4 }], // 125
  [{ symbol: '5', length: 3 }, { symbol: '3', length: 5 }], // 100
  [{ symbol: '4', length: 3 }, { symbol: '3', length: 4 }, { symbol: '2', length: 5 }], // 75
  [{ symbol: '3', length: 3 }, { symbol: '2', length: 4 }, { symbol: '1', length: 5 }], // 50
  [{ symbol: '2', length: 3 }, { symbol: '1', length: 4 }, { symbol: '0', length: 5 }], // 25
  [{ symbol: '0', length: 4 }], // 10
  [{ symbol: '1', length: 3 }, { symbol: '0', length: 3 }], // 5
];

// Function of getting Combinations in Array for calculateSlot
// source : https://gist.github.com/axelpale/3118596
function kComb(set, k) {
  var i, j, combs, head, tailcombs;
  if (k > set.length || k <= 0) {
    return [];
  }
  if (k === set.length) {
    return [set];
  }
  if (k === 1) {
    combs = [];
    for (i = 0; i < set.length; i += 1) {
      combs.push([set[i]]);
    }
    return combs;
  }
  combs = [];
  for (i = 0; i < set.length - k + 1; i += 1) {
    head = set.slice(i, i + 1);
    tailcombs = kComb(set.slice(i + 1), k - 1);
    for (j = 0; j < tailcombs.length; j += 1) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
}

const WIN_LINE = [
  [0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 2],
  [2, 1, 0, 1, 2, 3],
  [0, 1, 2, 1, 2, 4],
  [0, 0, 1, 2, 2, 5],
  [2, 2, 1, 0, 0, 6],
  [1, 0, 0, 0, 1, 7],
  [1, 2, 2, 2, 1, 8],
  [0, 1, 0, 1, 0, 9],
  [2, 1, 2, 1, 2, 10],
  [1, 2, 1, 2, 1, 11],
  [1, 0, 1, 0, 1, 12],
  [1, 1, 0, 1, 1, 13],
  [1, 1, 2, 1, 1, 14],
  [0, 1, 1, 1, 0, 15],
  [2, 1, 1, 1, 2, 16],
  [0, 2, 0, 2, 0, 17],
  [2, 0, 2, 0, 2, 18],
  [2, 0, 1, 0, 2, 19],
];
const WIN_LINE_COLOR = [0xffe600, 0xff1c71, 0x00e9dd, 0x7923ff, 0x00ff64, 0xff1043, 0x2350ff, 0xff6c00];

export default class SlotGame {
  constructor(params) {
    if (!params.canvas) {
      return;
    }
    // constructor params has properties like below.
    // canvas, betSize, lineNum, bankRoll, betUnit, minBet, maxBet,
    // setBetSizeFunc, setLineNumFunc, spinStartFunc, yourStake
    for (const prop in params) {
      this[prop] = params[prop];
    }
    // Function List
    this.gameLoop = this.gameLoop.bind(this);
    this.startSpin = this.startSpin.bind(this);
    this.stopSpin = this.stopSpin.bind(this);
    this.drawUI = this.drawUI.bind(this);
    this.stopReel = this.stopReel.bind(this);
    this.changeSlot = this.changeSlot.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.calculateSlot = this.calculateSlot.bind(this);
    this.makeRandomPrize = this.makeRandomPrize.bind(this);
    this.drawBigWin = this.drawBigWin.bind(this);
    this.errorOccur = this.errorOccur.bind(this);
    this.autoSpinSwitch = this.autoSpinSwitch.bind(this);
    this.checkValidity = this.checkValidity.bind(this);
    this.getPayLineInfos = this.getPayLineInfos.bind(this);
    // PIXI Element
    this.renderer = null;
    this.blurFilter = new PIXI.filters.BlurYFilter(10);
    this.lsdFilter = new PIXI.filters.ColorMatrixFilter();
    this.lsdFilter.lsd();
    this.winLines = new PIXI.Graphics();
    // Game Variable Initialization
    this.stage = null;
    this.gameState = STATE_ZERO;
    this.spinStatus = new Array(ENTIRE_REEL_COUNT).fill(true);
    this.rotateStatus = new Array(ENTIRE_REEL_COUNT).fill(false);
    this.slowingDistance = null;
    this.drawingLineIndex = null;
    this.winMoney = 0;
    this.autoSpinStatus = false;
    // Animation Variable Initialization
    this.bigWinPopping = 1; // Inflates when this value is 1, shrinks when this value is -1.
    this.requestId = null;
    this.winMoneyTextVel = 0;
    this.winMoneyTextAcc = 0.003;
    this.drawingLines = [];
    this.drawWinMoneyPercentage = 0;
    // Set Entire Canvas Properties
    this.renderer = new PIXI.autoDetectRenderer(940, 660, {
      view: this.canvas,
      antialias: true,
      transparent: false,
      resolution: 1,
    });

    this.renderer.view.style.display = 'block';
    this.renderer.view.style.margin = 'auto';
    this.renderer.backgroundColor = 0xefefef;
    this.renderer.autoResize = true;

    // Create a container object called the `stage`
    this.stage = new PIXI.Container();
    this.symbols = new Array(ALL_SYMBOL_COUNT);

    this.UIContainer = new PIXI.Container();
    this.reelContainer = new PIXI.Container();

    this.reelGroup = new Array(ENTIRE_REEL_COUNT * 2).fill(1);
    this.newReelGroup = null;

    this.reelGroup.forEach((reelItem, index) => {
      this.reelGroup[index] = new PIXI.Container();
      this.reelGroup[index].vy = 0;
    });
    // Add the canvas to the HTML document
    PIXI.loader
      .add([
        'assets/images/symbolsMap.json',
        'assets/images/slotMap.json',
        'assets/images/slot/big-win-front@2x.png',
        'assets/images/slot/circle-big-win-15-x@2x.png',
        'assets/images/slot/oval-14@2x.png',
        'assets/images/slot/auto-stop@2x.png',
      ])
      .on('progress', (loader, resource) => {
        console.log('LOADING...');
      })
      .load(() => {
        this.drawUI();
        // Make frame list from spriteSheets symbol by symbol.
        const spritesNum = [9, 7, 6, 7, 6, 9, 24, 19, 23, 24, 24, 24, 24];
        for (let i = 1; i <= ALL_SYMBOL_COUNT; i += 1) {
          const imglist = [];
          for (let j = 0; j < spritesNum[i - 1]; j += 1) {
            const val = j < 10 ? `0${j}` : j;
            const frame = PIXI.Texture.fromFrame(`Symbol${i}_${val}.png`);
            imglist.push(frame);
          }
          this.symbols[i - 1] = imglist;
        }
        // Random symbol's coordinates are set per reelGroup.
        for (let reelNum = 0; reelNum < ENTIRE_REEL_COUNT; reelNum += 1) {
          for (let idx = 0; idx < ITEM_PER_ENTIRE_REEL; idx += 1) {
            const randomNum = Math.floor(Math.random() * ALL_SYMBOL_COUNT);
            const symbol = new PIXI.extras.AnimatedSprite(this.symbols[randomNum]);
            symbol.width = SYMBOL_WIDTH;
            symbol.height = SYMBOL_HEIGHT;
            symbol.x = 0;
            symbol.y =
              idx < ITEMS_PER_HALF_REEL
                ? (symbol.height + SYMBOL_HEIGHT_GAP) * idx
                : (symbol.height + SYMBOL_HEIGHT_GAP) * (idx - ITEMS_PER_HALF_REEL);
            symbol.animationSpeed = 0.3;
            symbol.play();
            if (idx < ITEMS_PER_HALF_REEL) {
              this.reelGroup[reelNum * 2].addChild(symbol);
            } else {
              this.reelGroup[reelNum * 2 + 1].addChild(symbol);
            }
          }
          this.reelContainer.addChild(this.reelGroup[reelNum * 2]);
          this.reelContainer.addChild(this.reelGroup[reelNum * 2 + 1]);

          // Set reel group position
          this.reelGroup[reelNum * 2].y = 0;
          this.reelGroup[reelNum * 2 + 1].y = (SYMBOL_HEIGHT + SYMBOL_HEIGHT_GAP) * ITEMS_PER_HALF_REEL;
          this.reelGroup[reelNum * 2].x = (SYMBOL_WIDTH + SYMBOL_WIDTH_GAP) * reelNum;
          this.reelGroup[reelNum * 2 + 1].x = (SYMBOL_WIDTH + SYMBOL_WIDTH_GAP) * reelNum;
        }

        this.reelContainer.x = SLOT_START_X;
        this.reelContainer.y = SLOWING_DISTANCE;
        this.stage.addChild(this.reelContainer);
        this.stage.addChild(this.UIContainer);
        // Tell the `renderer` to `render` the `stage`
        this.renderer.render(this.stage);
        // When load function is ended, then start gameLoop
        this.gameLoop();
      });
  }

  startSpin() {
    if (this.gameState !== STATE_WAITING) return;
    if (this.yourStake < this.betSize * this.lineNum) {
      Toast.notie.alert({
        type: 'error',
        text: "You don't have enough stake. Deposit more eth!",
      });
      this.autoSpinSwitch();
      return;
    }
    this.winLines.clear();
    this.gameState = STATE_SPINNING;
    this.reelGroup.forEach(reel => {
      reel.vy = 60;
      reel.filters = [this.blurFilter];
    });
    this.spinStatus.fill(true);
    this.bigWinContainer.visible = false;
    this.winMoneyText.visible = false;
    this.ovalBackground.visible = false;
    this.drawingLines = [];
    this.playGame();
  }

  autoSpinSwitch() {
    if (this.autoSpinStatus === false) {
      this.autoSpinStatus = true;
      this.autoBtn.visible = false;
      this.autoStopBtn.visible = true;
    } else {
      this.autoSpinStatus = false;
      this.autoBtn.visible = true;
      this.autoStopBtn.visible = false;
    }
  }

  gameLoop() {
    if (this.gameState === STATE_ZERO) {
      this.gameState = STATE_WAITING;
    } else if (this.gameState === STATE_WAITING) {
      if (this.betSize !== undefined) this.betSizeText.text = this.betSize;
      if (this.lineNum !== undefined) this.lineNumText.text = `${this.lineNum}`;
      if (this.yourStake !== undefined) this.yourStakeText.text = `${this.yourStake} ETH`;
      if (this.bankRoll !== undefined) this.bankRollText.text = `${this.bankRoll} ETH`;
      if (this.lineNum !== undefined && this.betSize !== undefined)
        this.betAmountText.text = this.betSize.times(this.lineNum);
      if (this.bigWinContainer.visible) {
        this.bigWinContainer.scale.x += 0.005 * this.bigWinPopping;
        this.bigWinContainer.scale.y += 0.005 * this.bigWinPopping;
        if (Math.abs(this.bigWinContainer.scale.x - 1) > 0.15) {
          this.bigWinPopping *= -1;
        }
      }
      console.log('WAITING...');
      if (this.autoSpinStatus) this.startSpin();
    } else if (this.gameState === STATE_SPINNING) {
      this.reelGroup.forEach(reel => {
        reel.y += reel.vy;
        if (reel.y > reel.height) {
          reel.y -= reel.height * 2;
        }
      });
    } else if (this.gameState === STATE_STOPPING) {
      this.reelGroup.forEach((reel, index) => {
        if (!this.spinStatus[Math.floor(index / 2)]) {
          if (this.reelGroup[index] !== null) {
            this.reelGroup[index].destroy();
            this.reelGroup[index] = null;
            this.reelContainer.addChildAt(this.newReelGroup[index], index);
          } else if (this.slowingDistance[index] > 0) {
            this.reelContainer.children[index].y += 10;
            this.slowingDistance[index] -= 10;
          }
        } else {
          reel.y += reel.vy;
          if (reel.y > reel.height) {
            reel.y -= reel.height * 2;
          }
        }
      });
    } else if (this.gameState === STATE_DRAWING) {
      if (this.drawingLineIndex < this.drawingPercentageList.length) {
        // Draw until matching percentage List
        if (this.drawingPercentageList[this.drawingLineIndex] <= 1) {
          // Drawing Line percentage's intensification factor. When it's larger, it draws faster.
          this.drawingPercentageList[this.drawingLineIndex] += 0.05;
          // Current line's drawing percentage
          const p = this.drawingPercentageList[this.drawingLineIndex];
          let moveX;
          let moveY;
          let partP;
          let angle;
          const lineNum = this.drawingLines[this.drawingLineIndex].lineNum;
          this.winLines.lineStyle(6, WIN_LINE_COLOR[this.drawingLineIndex % WIN_LINE_COLOR.length], 0.8);
          // Starting Point of Current line.
          const startX = this.reelContainer.x + SYMBOL_WIDTH / 2;
          const startY =
            this.reelContainer.y + SYMBOL_HEIGHT / 2 + (WIN_LINE[lineNum][0] + 1) * (SYMBOL_HEIGHT + SYMBOL_HEIGHT_GAP);
          this.winLines.moveTo(startX, startY);
          for (let j = 1; j < ENTIRE_REEL_COUNT; j += 1) {
            if (j * 0.25 > p && p > (j - 1) * 0.25) {
              // Every Win Line can be divided to 4 parts.
              // partP means part Percentage at 1 part.
              partP = (p - (j - 1) * 0.25) / 0.25;
              angle =
                (WIN_LINE[lineNum][j] - WIN_LINE[lineNum][j - 1]) *
                (SYMBOL_HEIGHT + SYMBOL_HEIGHT_GAP * 2) /
                (SYMBOL_WIDTH + SYMBOL_WIDTH_GAP);
              moveX = startX + (SYMBOL_WIDTH + SYMBOL_WIDTH_GAP) * (j - 1) + (SYMBOL_WIDTH + SYMBOL_WIDTH_GAP) * partP;
              moveY =
                this.reelContainer.y +
                SYMBOL_HEIGHT / 2 +
                (WIN_LINE[lineNum][j - 1] + 1) * (SYMBOL_HEIGHT + SYMBOL_HEIGHT_GAP);
              moveY += (SYMBOL_HEIGHT + SYMBOL_HEIGHT_GAP) * partP * angle;
            } else if (p > (j - 1) * 0.25) {
              moveX = startX + (SYMBOL_WIDTH + SYMBOL_WIDTH_GAP) * j;
              moveY =
                this.reelContainer.y +
                SYMBOL_HEIGHT / 2 +
                (WIN_LINE[lineNum][j] + 1) * (SYMBOL_HEIGHT + SYMBOL_HEIGHT_GAP);
            } else {
              break;
            }
            this.winLines.lineTo(moveX, moveY);
          }
        } else {
          this.drawingLineIndex += 1;
        }
      } else if (this.drawWinMoneyPercentage <= 1) {
        this.drawWinMoneyPercentage += 0.01;
        if (this.winMoneyText.scale.x <= 1) {
          this.winMoneyTextVel += this.winMoneyTextAcc;
          this.winMoneyText.scale.x += this.winMoneyTextVel;
          this.winMoneyText.scale.y += this.winMoneyTextVel;
          this.winMoneyText.alpha += this.winMoneyTextVel;
          this.ovalBackground.scale.x += this.winMoneyTextVel;
          this.ovalBackground.scale.y += this.winMoneyTextVel;
          this.ovalBackground.alpha += this.winMoneyTextVel;
        }
      } else {
        this.drawingPercentageList = null;
        this.gameState = STATE_WAITING;
      }
    } else if (this.gameState === STATE_BIG_WIN) {
      if (this.bigWinPercentage <= 1) {
        this.bigWinPercentage += 0.01;
        this.reelGroup.forEach(reel => {
          reel.y += reel.vy;
          if (reel.y > reel.height) {
            reel.y -= reel.height * 2;
          }
        });
      } else if (this.bigWinPercentage <= 2) {
        this.bigWinContainer.scale.x += 0.015;
        this.bigWinContainer.scale.y += 0.015;
        this.bigWinContainer.alpha += 0.015;
        this.bigWinPercentage += 0.015;
        this.reelGroup.forEach(reel => {
          reel.y += reel.vy;
          if (reel.y > reel.height) {
            reel.y -= reel.height * 2;
          }
        });
      } else if (this.bigWinPercentage <= 3) {
        if (this.winMoneyText.scale.x <= 1) {
          this.winMoneyTextVel += this.winMoneyTextAcc;
          this.winMoneyText.scale.x += this.winMoneyTextVel;
          this.winMoneyText.scale.y += this.winMoneyTextVel;
          this.winMoneyText.alpha += this.winMoneyTextVel;
          this.ovalBackground.scale.x += this.winMoneyTextVel;
          this.ovalBackground.scale.y += this.winMoneyTextVel;
          this.ovalBackground.alpha += this.winMoneyTextVel;
        }
        this.bigWinPercentage += 0.01;
        this.reelGroup.forEach(reel => {
          reel.y += reel.vy;
          if (reel.y > reel.height) {
            reel.y -= reel.height * 2;
          }
        });
      } else if (this.bigWinPercentage <= 4) {
        this.reelGroup.forEach((reel, index) => {
          if (this.reelGroup[index] !== null) {
            this.reelGroup[index].destroy();
            this.reelGroup[index] = null;
            this.newReelGroup[index].y += SLOWING_DISTANCE;
            this.reelContainer.addChildAt(this.newReelGroup[index], index);
          }
        });
        this.bigWinPercentage += 0.05;
      } else {
        this.reelGroup = this.newReelGroup;
        this.gameState = STATE_WAITING;
      }
    }

    // Render the stage to see the animation
    this.requestId = window.requestAnimationFrame(this.gameLoop);
    this.renderer.render(this.stage);
  }

  drawBigWin() {
    if (this.gameState === STATE_SPINNING) {
      this.gameState = STATE_BIG_WIN;
      this.bigWinPercentage = 0;
      this.bigWinContainer.visible = true;
      this.bigWinContainer.scale.set(0, 0);
      this.bigWinContainer.alpha = 0;
      this.winMoneyTextVel = 0;
      this.winMoneyText.visible = true;
      this.winMoneyText.scale.set(0, 0);
      this.winMoneyText.alpha = 0;
      this.winMoneyText.text = `+${this.winMoney} ETH`;
      this.ovalBackground.width = 50 * this.winMoneyText.text.length;
      this.ovalBackground.visible = true;
      this.ovalBackground.scale.set(0, 0);
      this.ovalBackground.alpha = 0;
      this.reelGroup.forEach(reel => {
        reel.filters = [this.lsdFilter, this.blurFilter];
      });
      this.changeSlot();
    }
  }
  async stopSpin(slotResult) {
    if (this.gameState === STATE_SPINNING) {
      const calculateResult = this.calculateSlot(slotResult);
      if (calculateResult === 'BIG_WIN') {
        this.drawBigWin();
        return;
      }
      this.slowingDistance = new Array(ENTIRE_REEL_COUNT * 2).fill(SLOWING_DISTANCE);
      await this.changeSlot();
      const valid = await this.checkValidity(this.slotLineInfo);
      if (!valid) {
        this.drawBigWin();
        return;
      }
      this.gameState = STATE_STOPPING;
      for (let i = 0; i < ENTIRE_REEL_COUNT; i += 1) {
        await this.stopReel(i);
      }
      // After reels stop, draw win lines.
      if (calculateResult === 'DRAW_LINE') {
        await this.drawLine();
        this.drawWinMoneyPercentage = 0;
        this.winMoneyTextVel = 0;
        this.winMoneyText.visible = true;
        this.winMoneyText.scale.set(0, 0);
        this.winMoneyText.alpha = 0;
        this.winMoneyText.text = `+${this.winMoney} ETH`;
        this.ovalBackground.width = 50 * this.winMoneyText.text.length;
        this.ovalBackground.visible = true;
        this.ovalBackground.scale.set(0, 0);
        this.ovalBackground.alpha = 0;
      } else {
        this.gameState = STATE_WAITING;
      }
    }
  }

  async errorOccur() {
    if (this.gameState === STATE_SPINNING) {
      await this.changeSlot();
      this.reelGroup.forEach((reel, index) => {
        this.reelGroup[index].destroy();
        this.reelGroup[index] = null;
        this.reelContainer.addChildAt(this.newReelGroup[index], index);
        this.reelContainer.children[index].y += SLOWING_DISTANCE;
      });
      this.reelGroup = this.newReelGroup;
      this.autoSpinSwitch();
      this.gameState = STATE_WAITING;
    }
  }

  drawLine() {
    this.gameState = STATE_DRAWING;
    this.drawingPercentageList = new Array(this.drawingLines.length).fill(0);
    this.drawingLineIndex = 0;
  }

  stopReel(reelNum) {
    return new Promise(resolve => {
      this.spinStatus[reelNum] = false;
      this.rotateStatus[reelNum] = true;
      setTimeout(() => {
        this.rotateStatus[reelNum] = false;
        if (reelNum === ENTIRE_REEL_COUNT - 1) {
          this.reelGroup = this.newReelGroup;
        }
        resolve(reelNum);
      }, 1000);
    });
  }

  makeRandomPrize(lineNum) {
    let prize = 0;
    for (let i = 0; i < lineNum; i += 1) {
      let nowProbability = 0;
      const randomCase = Math.random();
      for (let j = 0; j <= PROBABILITY_TABLE.length; j += 1) {
        nowProbability += PROBABILITY_TABLE[j];
        if (randomCase < nowProbability) {
          prize += PROBABILITY_VALUE_TABLE[j];
          break;
        }
      }
    }
    return prize;
  }
  getPayLineInfos(sumPrize) {
    const lineCaseArr = [];
    const duplicatedObj = {};
    const payLineInfos = [];

    for (let i = 0; i < PROBABILITY_VALUE_TABLE.length - 1; i += 1) {
      // Prize has to be selected by reverse order.
      const prize = Big(this.betSize * PROBABILITY_VALUE_TABLE[PROBABILITY_VALUE_TABLE.length - 1 - i]);
      if (sumPrize >= prize) {
        const prizeNum = Math.floor(sumPrize / prize);
        for (let j = 0; j < prizeNum; j += 1) {
          lineCaseArr.push(i);
        }
        sumPrize = sumPrize.minus(prize.times(prizeNum));
      }
    }
    for (let i = 0; i < lineCaseArr.length; i += 1) {
      const lineCaseIndex = lineCaseArr[i];
      for (let j = 0; j < LINE_CASES[lineCaseIndex].length; j += 1) {
        const lineCaseSymbol = LINE_CASES[lineCaseIndex][j].symbol;
        const lineCaseLength = LINE_CASES[lineCaseIndex][j].length;
        if (duplicatedObj[lineCaseSymbol] === undefined) {
          duplicatedObj[lineCaseSymbol] = {
            count: 1,
            length: lineCaseLength,
          };
        } else {
          duplicatedObj[lineCaseSymbol].count += 1;
          duplicatedObj[lineCaseSymbol].length += lineCaseLength;
        }
      }
    }
    for (let i = 0; i < lineCaseArr.length; i += 1) {
      const lineCaseIndex = lineCaseArr[i];
      let minDuplicate = 100;
      let minLength = 0;
      let resultSymbol;
      for (let j = 0; j < LINE_CASES[lineCaseIndex].length; j += 1) {
        const lineCase = LINE_CASES[lineCaseIndex][j];
        const lineCaseSymbol = lineCase.symbol;
        if (minDuplicate > duplicatedObj[lineCaseSymbol].count) {
          minDuplicate = duplicatedObj[lineCaseSymbol].count;
          minLength = duplicatedObj[lineCaseSymbol].length;
          resultSymbol = lineCaseSymbol;
        } else if (minDuplicate === duplicatedObj[lineCaseSymbol].count) {
          if (minLength > duplicatedObj[lineCaseSymbol].length) {
            minLength = duplicatedObj[lineCaseSymbol].length;
            resultSymbol = lineCaseSymbol;
          }
        }
      }
      for (let j = 0; j < LINE_CASES[lineCaseIndex].length; j += 1) {
        if (resultSymbol === LINE_CASES[lineCaseIndex][j].symbol) {
          payLineInfos.push(LINE_CASES[lineCaseIndex][j]);
          break;
        }
      }
    }
    return payLineInfos;
  }
  checkValidity(slotLineInfo) {
    return new Promise(resolve => {
      let calculatedMoney = Big(0);
      const calculatedLines = [];
      for (let i = 0; i < this.lineNum; i += 1) {
        const nowLine = WIN_LINE[i];
        const slotQueue = [];
        for (let j = 0; j < ENTIRE_REEL_COUNT; j += 1) {
          const slotY = nowLine[j];
          slotQueue.push(slotLineInfo[j][slotY]);
        }
        const symbol = slotQueue.shift()[0];
        let length = 1;
        while (slotQueue.length !== 0) {
          const queueSymbol = slotQueue.shift()[0];
          if (symbol === queueSymbol) {
            length += 1;
          } else {
            break;
          }
        }
        let found = false;
        if (length >= 3) {
          for (let j = 0; j < LINE_CASES.length; j += 1) {
            for (let k = 0; k < LINE_CASES[j].length; k += 1) {
              const lineCase = LINE_CASES[j][k];
              if (lineCase.symbol === symbol && lineCase.length === length) {
                const lineCaseObj = {
                  lineNum: i,
                  symbol: lineCase.symbol,
                  length: lineCase.length,
                };
                calculatedLines.push(lineCaseObj);
                const price = this.betSize.times(PROBABILITY_VALUE_TABLE[PROBABILITY_VALUE_TABLE.length - 1 - j]);
                calculatedMoney = calculatedMoney.plus(price);
                found = true;
                break;
              }
            }
            if (found) break;
          }
        }
      }
      if (calculatedMoney.eq(this.winMoney)) resolve(true);
      resolve(false);
    });
  }
  calculateSlot(sumPrize) {
    const lineNum = this.lineNum;
    this.winMoney = sumPrize;
    if (sumPrize.eq(0)) {
      // Earn nothing.
      return 0;
    }
    const lineInfos = this.getPayLineInfos(sumPrize); // Minimum drawing line's info.
    const needLineNum = lineInfos.length;
    if (lineNum < needLineNum) return 'BIG_WIN';
    if (needLineNum === 1) {
      const randNum = Math.floor(Math.random() * lineNum);
      const drawingLine = {
        lineNum: randNum,
        symbol: lineInfos[0].symbol,
        length: lineInfos[0].length,
      };
      this.drawingLines.push(drawingLine);
      return 'DRAW_LINE';
    }
    // Save Slot Infos for avoiding inconsistency.
    const slotLineInfo = new Array(ENTIRE_REEL_COUNT);
    for (let i = 0; i < ENTIRE_REEL_COUNT; i += 1) {
      slotLineInfo[i] = new Array(3).fill(undefined);
    }
    let usableLines = WIN_LINE.slice(0, lineNum);
    usableLines = shuffle(usableLines);
    // First, we have to find Lines that use same symbols.
    const sameSymbolObj = {};
    const symbolObj = {};
    const singleSymbolArr = [];
    for (let i = 0; i < lineInfos.length; i += 1) {
      const symbol = lineInfos[i].symbol;
      if (symbolObj[symbol] === undefined) {
        symbolObj[symbol] = [lineInfos[i]];
      } else {
        symbolObj[symbol].push(lineInfos[i]);
      }
    }
    for (const key in symbolObj) {
      if (symbolObj[key].length >= 2) {
        sameSymbolObj[key] = symbolObj[key];
      } else {
        singleSymbolArr.push(symbolObj[key][0]);
      }
    }
    // If there are no duplicated symbols,
    if (Object.keys(sameSymbolObj).length === 0) {
      let drawingLine;
      let possibleIndex; // undefined
      const duplicatedCheckArr = [];
      // LineIndexArr is set for getting random combination from usableLines
      const lineIndexArr = [];
      for (let p = 0; p < usableLines.length; p += 1) {
        lineIndexArr.push(p);
      }
      const combArr = kComb(lineIndexArr, needLineNum);
      for (let i = 0; i < combArr.length; i += 1) {
        let duplicated = false;
        for (let j = 0; j < ENTIRE_REEL_COUNT; j += 1) {
          duplicatedCheckArr[j] = new Array(3).fill(undefined);
        }
        for (let j = 0; j < needLineNum; j += 1) {
          const lineIndex = combArr[i][j];
          for (let k = 0; k < lineInfos[j].length; k += 1) {
            const slotY = usableLines[lineIndex][k];
            if (duplicatedCheckArr[k][slotY] !== undefined) {
              // It means overLapping
              duplicated = true;
              break;
            }
          }
          if (duplicated) break;
          for (let k = 0; k < lineInfos[j].length; k += 1) {
            const slotY = usableLines[lineIndex][k];
            duplicatedCheckArr[k][slotY] = lineInfos[j].symbol;
          }
        }
        if (!duplicated) {
          possibleIndex = i;
          break;
        }
      }
      if (possibleIndex === undefined) {
        return 'BIG_WIN';
      } else {
        for (let i = 0; i < needLineNum; i += 1) {
          const lineIndex = combArr[possibleIndex][i];
          drawingLine = {
            lineNum: usableLines[lineIndex][5], // Fifth index is original win lineNum.
            symbol: lineInfos[i].symbol,
            length: lineInfos[i].length,
          };
          this.drawingLines.push(drawingLine);
        }
        return 'DRAW_LINE';
      }
      // else, we have to draw duplicated symbol lines with minimum distance lines.
    } else {
      const distanceCompArr = new Array(ENTIRE_REEL_COUNT);
      let drawingLine;
      // First draw sameSymbol Lines.
      // i means same symbol Array.
      for (let i = 0; i < Object.keys(sameSymbolObj).length; i += 1) {
        const symbol = Object.keys(sameSymbolObj)[i];
        const sameSymbolLinesNum = sameSymbolObj[symbol].length;
        // LineIndexArr is set for getting random combination from usableLines
        const lineIndexArr = [];
        for (let p = 0; p < usableLines.length; p += 1) {
          lineIndexArr.push(p);
        }
        const combArr = kComb(lineIndexArr, sameSymbolLinesNum);
        // Finding combination that has minimum distance.
        // j means symbol Arr combinations
        let minDist = 15;
        let minCombIndex; // undefined
        for (let j = 0; j < combArr.length; j += 1) {
          let overLapping = false;
          // distanceCompArr Initialization
          for (let q = 0; q < ENTIRE_REEL_COUNT; q += 1) {
            distanceCompArr[q] = new Array(3).fill(undefined);
          }
          let distance = 0;
          // Doing calculate Distance
          // k means combination's element
          for (let k = 0; k < combArr[j].length; k += 1) {
            const lineIndex = combArr[j][k];
            for (let l = 0; l < sameSymbolObj[symbol][k].length; l += 1) {
              const slotY = usableLines[lineIndex][l];
              if (slotLineInfo[l][slotY] !== undefined) {
                // It means overLapping
                overLapping = true;
                break;
              } else if (distanceCompArr[l][slotY] === symbol) {
                distanceCompArr[l][slotY] = symbol;
              } else {
                distanceCompArr[l][slotY] = symbol;
                distance += 1;
              }
            }
            for (let l = sameSymbolObj[symbol][k].length; l < 5; l += 1) {
              const slotY = usableLines[lineIndex][l];
              if (distanceCompArr[l][slotY] === symbol) {
                overLapping = true;
                break;
              }
            }
            if (overLapping) break;
          }
          if (!overLapping && distance < minDist) {
            minDist = distance;
            minCombIndex = j;
          }
        }
        // minCombIndex is still undefined After loop, we can't draw it.
        if (minCombIndex === undefined) return 'BIG_WIN';
        // We have to insert that combination of lines to slotLineInfo.
        for (let j = 0; j < combArr[minCombIndex].length; j += 1) {
          const lineIndex = combArr[minCombIndex][j];
          for (let k = 0; k < sameSymbolObj[symbol][j].length; k += 1) {
            const slotY = usableLines[lineIndex][k];
            slotLineInfo[k][slotY] = symbol;
          }
          drawingLine = {
            lineNum: usableLines[lineIndex][5], // Fifth index is original win lineNum.
            symbol: symbol,
            length: sameSymbolObj[symbol][j].length,
          };
          this.drawingLines.push(drawingLine);
        }
        // We have to delete lines where we find min distance for quality.
        let lastIndex = 0;
        const newUsableLines = [];
        for (let j = 0; j < combArr[minCombIndex].length; j += 1) {
          newUsableLines.push(...usableLines.slice(lastIndex, combArr[minCombIndex][j]));
          lastIndex = combArr[minCombIndex][j] + 1;
        }
        newUsableLines.push(...usableLines.slice(lastIndex, usableLines.length));
        usableLines = newUsableLines;
      }
      // After draw same symbol lines, we have to draw single symbol lines.
      for (let i = 0; i < singleSymbolArr.length; i += 1) {
        let drawable = false;
        for (let j = 0; j < usableLines.length; j += 1) {
          // Check for overLapping Line.
          let overLapping = false;
          for (let k = 0; k < singleSymbolArr[i].length; k += 1) {
            const slotY = usableLines[j][k];
            if (slotLineInfo[k][slotY] !== undefined) {
              overLapping = true;
              break;
            }
          }
          // If not overLapping, 'i' drawingLine is drawn with 'j' usableLines.
          if (!overLapping) {
            for (let k = 0; k < lineInfos[i].length; k += 1) {
              const slotY = usableLines[j][k];
              slotLineInfo[k][slotY] = singleSymbolArr[i].symbol;
            }
            drawingLine = {
              lineNum: usableLines[j][5],
              symbol: singleSymbolArr[i].symbol,
              length: singleSymbolArr[i].length,
            };
            this.drawingLines.push(drawingLine);
            drawable = true;
            break;
          }
        }
        if (!drawable) return 'BIG_WIN';
      }
      return 'DRAW_LINE';
    }
  }

  changeSlot() {
    return new Promise(resolve => {
      this.newReelGroup = new Array(ENTIRE_REEL_COUNT * 2).fill(1);
      this.newReelGroup.forEach((reelItem, index) => {
        this.newReelGroup[index] = new PIXI.Container();
        this.newReelGroup[index].vy = 0;
      });
      // Save Slot Infos for avoiding inconsistency.
      this.slotLineInfo = new Array(ENTIRE_REEL_COUNT);
      for (let i = 0; i < ENTIRE_REEL_COUNT; i += 1) {
        this.slotLineInfo[i] = [];
      }
      // If drawingLines exist, have not to draw that symbol.
      let avoidSymbolArr = [];
      for (let i = 0; i < this.drawingLines.length; i += 1) {
        avoidSymbolArr.push(this.drawingLines[i].symbol);
      }
      // Delete duplicated value from avoidSymbolArr.
      avoidSymbolArr = Array.from(new Set(avoidSymbolArr));
      let randomNum;
      let randomNumString;
      for (let reelNum = 0; reelNum < ENTIRE_REEL_COUNT; reelNum += 1) {
        for (let idx = 0; idx < ITEM_PER_ENTIRE_REEL; idx += 1) {
          do {
            randomNum = Math.floor(Math.random() * ALL_SYMBOL_COUNT);
            randomNumString = randomNum.toString();
          } while (avoidSymbolArr.indexOf(randomNumString) !== -1);
          const symbol = new PIXI.extras.AnimatedSprite(this.symbols[randomNum]);
          // Save Slot Infos for avoiding inconsistency.
          // When reelNum is [0, 1, 2, 3, 4] and idx is [1, 2, 3]
          if ([1, 2, 3].indexOf(idx) !== -1) {
            this.slotLineInfo[reelNum].push(randomNumString);
          }
          symbol.width = SYMBOL_WIDTH;
          symbol.height = SYMBOL_HEIGHT;
          symbol.x = 0;
          symbol.y =
            idx < ITEMS_PER_HALF_REEL
              ? (symbol.height + SYMBOL_HEIGHT_GAP) * idx
              : (symbol.height + SYMBOL_HEIGHT_GAP) * (idx - ITEMS_PER_HALF_REEL);
          symbol.animationSpeed = 0.3;
          symbol.play();
          if (idx < ITEMS_PER_HALF_REEL) {
            this.newReelGroup[reelNum * 2].addChild(symbol);
          } else {
            this.newReelGroup[reelNum * 2 + 1].addChild(symbol);
          }
        }

        // Set reel group position
        this.newReelGroup[reelNum * 2].y = -1 * SLOWING_DISTANCE;
        this.newReelGroup[reelNum * 2 + 1].y =
          (SYMBOL_HEIGHT + SYMBOL_HEIGHT_GAP) * ITEMS_PER_HALF_REEL - SLOWING_DISTANCE;
        this.newReelGroup[reelNum * 2].x = (SYMBOL_WIDTH + SYMBOL_WIDTH_GAP) * reelNum;
        this.newReelGroup[reelNum * 2 + 1].x = (SYMBOL_WIDTH + SYMBOL_WIDTH_GAP) * reelNum;
      }

      // We have to consider only visible part.
      // So care about just newReelGroup[0 || 2 || 4 || 8][1 || 2 || 3]
      if (this.drawingLines.length === 0) {
        // In this case, Slot should have none of Win Lines.
        const secondReelInfos = Array.from(new Set(this.slotLineInfo[1]));
        let i = 0;
        while (i < 3) {
          const symbolNum = this.slotLineInfo[2][i];
          if (secondReelInfos.indexOf(symbolNum) === -1) {
            // Pass
            i += 1;
          } else {
            // have to Change
            randomNum = Math.floor(Math.random() * ALL_SYMBOL_COUNT);
            this.newReelGroup[4].children[i + 1].textures = this.symbols[randomNum];
            this.slotLineInfo[2][i] = randomNum.toString();
          }
        }
      } else {
        // First, change slot following drawingLines.
        for (let i = 0; i < this.drawingLines.length; i += 1) {
          const lineSymbol = this.drawingLines[i].symbol;
          const lineNum = this.drawingLines[i].lineNum;
          const lineLength = this.drawingLines[i].length;
          for (let j = 0; j < lineLength; j += 1) {
            const lineY = WIN_LINE[lineNum][j];
            this.newReelGroup[j * 2].children[lineY + 1].textures = this.symbols[lineSymbol];
            this.slotLineInfo[j][lineY] = `${lineSymbol}*`; // It means have to be not changed.
          }
        }
        // Second, slot should have none of Win Lines except drawingLines .
        const secondReelInfos = Array.from(new Set(this.slotLineInfo[1]));
        let i = 0;
        while (i < 3) {
          const symbolNum = this.slotLineInfo[2][i];
          if (symbolNum[1] === '*') {
            // Pass
            i += 1;
          } else if (secondReelInfos.indexOf(symbolNum) === -1 && avoidSymbolArr.indexOf(symbolNum) === -1) {
            // Pass
            i += 1;
          } else {
            // have to Change
            randomNum = Math.floor(Math.random() * ALL_SYMBOL_COUNT);
            this.newReelGroup[4].children[i + 1].textures = this.symbols[randomNum];
            this.slotLineInfo[2][i] = randomNum.toString();
          }
        }
      }
      resolve('success');
    });
  }

  removeCurrentGame() {
    PIXI.loader.reset();
    this.canvas.remove();
    window.cancelAnimationFrame(this.requestId);
  }

  drawUI() {
    const TextureCache = PIXI.utils.TextureCache;
    const Sprite = PIXI.Sprite;
    const Graphics = PIXI.Graphics;
    const Text = PIXI.Text;

    const mergedBackground = new Sprite(TextureCache['mergedImage.png']);
    mergedBackground.position.set(0, 0);
    mergedBackground.width = 940;
    mergedBackground.height = 660;

    const slotBackground = new Sprite(TextureCache['slot-background.png']);
    slotBackground.position.set(35, 110);
    slotBackground.width = 867;
    slotBackground.height = 481;

    const ribbon = new Sprite(TextureCache['ribbon.png']);
    ribbon.position.set(132, 77);
    ribbon.width = 675.6;
    ribbon.height = 491.3;

    const ribbonText = new Text('JACKPOT SLOT', {
      fontSize: '31.3px',
      letterSpacing: 1.3,
      align: 'center',
      fill: '0xf6b115',
    });
    ribbonText.anchor.set(0.5, 0.5);
    ribbonText.position.set(470, 120);

    const yourStake = new Sprite(TextureCache['your-stake.png']);
    yourStake.position.set(41.8, 12.3);
    yourStake.width = 351;
    yourStake.height = 60;

    this.yourStakeText = new Text('2.5345 ETH', {
      fontSize: '18.8px',
      letterSpacing: 0.8,
      align: 'right',
      fill: '0xffffff',
    });
    this.yourStakeText.anchor.set(1, 0.5);
    this.yourStakeText.position.set(365, 41);

    const bankRoll = new Sprite(TextureCache['bank-roll.png']);
    bankRoll.position.set(547, 12);
    bankRoll.width = 352;
    bankRoll.height = 61;

    this.bankRollText = new Text('14.3894 ETH', {
      fontSize: '18.8px',
      letterSpacing: 0.8,
      align: 'left',
      fill: '0xffffff',
    });
    this.bankRollText.anchor.set(0, 0.5);
    this.bankRollText.position.set(575, 41);

    const betAmount = new Sprite(TextureCache['bat-amount.png']);
    betAmount.position.set(42, 580);
    betAmount.width = 149;
    betAmount.height = 65;

    this.betAmountText = new Text('0.4', {
      fontSize: '18.8px',
      letterSpacing: 0.8,
      align: 'center',
      fill: '0xffffff',
    });
    this.betAmountText.anchor.set(0.5, 0.5);
    this.betAmountText.position.set(116, 620);

    const betSize = new Sprite(TextureCache['bet-size.png']);
    betSize.position.set(190, 580);
    betSize.width = 185;
    betSize.height = 65;

    this.betSizeText = new Text('0.12332', {
      fontSize: '18.8px',
      letterSpacing: 0.8,
      align: 'center',
      fill: '0xffffff',
    });
    this.betSizeText.anchor.set(0.5, 0.5);
    this.betSizeText.position.set(283, 620);

    const betMinusBtn = new Graphics();
    betMinusBtn.beginFill(0, 0);
    betMinusBtn.drawRect(194, 583, 38, 57);
    betMinusBtn.interactive = true;
    betMinusBtn.buttonMode = true;
    betMinusBtn.on('pointerdown', () => {
      if (this.gameState !== STATE_WAITING) return;
      if (this.betSize - this.betUnit >= this.minBet) {
        this.setBetSize(this.betSize.minus(this.betUnit));
      } else {
        this.setBetSize(Big(this.minBet));
      }
    });
    betMinusBtn.endFill();

    const betPlusBtn = new Graphics();
    betPlusBtn.beginFill(0, 0);
    betPlusBtn.drawRect(333, 583, 38, 57);
    betPlusBtn.interactive = true;
    betPlusBtn.buttonMode = true;
    betPlusBtn.on('pointerdown', () => {
      if (this.gameState !== STATE_WAITING) return;
      if (this.betSize + this.betUnit <= this.maxBet) {
        this.setBetSize(this.betSize.plus(this.betUnit));
      } else {
        this.setBetSize(Big(this.maxBet));
      }
    });
    betPlusBtn.endFill();

    const maxBet = new Sprite(TextureCache['max-bet.png']);
    maxBet.position.set(375, 580);
    maxBet.width = 63;
    maxBet.height = 65;
    maxBet.interactive = true;
    maxBet.buttonMode = true;
    maxBet.on('pointerdown', () => {
      if (this.gameState !== STATE_WAITING) return;
      this.setBetSize(this.maxBet);
      this.setLineNum(20);
    });

    const lineNum = new Sprite(TextureCache['line.png']);
    lineNum.position.set(436, 580);
    lineNum.width = 186;
    lineNum.height = 65;

    this.lineNumText = new Text('0.1', {
      fontSize: '18.8px',
      letterSpacing: 0.8,
      align: 'center',
      fill: '0xffffff',
    });
    this.lineNumText.anchor.set(0.5, 0.5);
    this.lineNumText.position.set(528, 620);

    const lineMinusBtn = new Graphics();
    lineMinusBtn.beginFill(0, 0);
    lineMinusBtn.drawRect(440, 583, 38, 57);
    lineMinusBtn.interactive = true;
    lineMinusBtn.buttonMode = true;
    lineMinusBtn.on('pointerdown', () => {
      if (this.gameState !== STATE_WAITING) return;
      if (this.lineNum > 1) {
        this.setLineNum(this.lineNum - 1);
      }
    });
    lineMinusBtn.endFill();

    const linePlusBtn = new Graphics();
    linePlusBtn.beginFill(0, 0);
    linePlusBtn.drawRect(580, 583, 38, 57);
    linePlusBtn.interactive = true;
    linePlusBtn.buttonMode = true;
    linePlusBtn.on('pointerdown', () => {
      if (this.gameState !== STATE_WAITING) return;
      if (this.lineNum < 20) {
        this.setLineNum(this.lineNum + 1);
      }
    });
    linePlusBtn.endFill();

    const spinBtn = new Sprite(TextureCache['spin.png']);
    spinBtn.interactive = true;
    spinBtn.buttonMode = true;
    spinBtn.on('pointerdown', this.startSpin);
    spinBtn.position.set(620, 580);
    spinBtn.width = 186;
    spinBtn.height = 65;

    this.autoBtn = new Sprite(TextureCache['auto.png']);
    this.autoBtn.interactive = true;
    this.autoBtn.buttonMode = true;
    this.autoBtn.on('pointerdown', this.autoSpinSwitch);
    this.autoBtn.position.set(804, 580);
    this.autoBtn.width = 93;
    this.autoBtn.height = 65;

    this.autoStopBtn = new Sprite.fromImage('assets/images/slot/auto-stop@2x.png');
    this.autoStopBtn.interactive = true;
    this.autoStopBtn.buttonMode = true;
    this.autoStopBtn.on('pointerdown', this.autoSpinSwitch);
    this.autoStopBtn.position.set(804, 580);
    this.autoStopBtn.width = 93;
    this.autoStopBtn.height = 65;
    this.autoStopBtn.visible = false;

    this.stage.addChild(slotBackground);
    this.UIContainer.addChild(mergedBackground);
    this.UIContainer.addChild(ribbon);
    this.UIContainer.addChild(yourStake);
    this.UIContainer.addChild(bankRoll);
    this.UIContainer.addChild(betAmount);
    this.UIContainer.addChild(betSize);
    this.UIContainer.addChild(betMinusBtn);
    this.UIContainer.addChild(betPlusBtn);
    this.UIContainer.addChild(maxBet);
    this.UIContainer.addChild(lineNum);
    this.UIContainer.addChild(lineMinusBtn);
    this.UIContainer.addChild(linePlusBtn);
    this.UIContainer.addChild(spinBtn);
    this.UIContainer.addChild(this.autoBtn);
    this.UIContainer.addChild(this.autoStopBtn);
    // Text Component
    this.UIContainer.addChild(ribbonText);
    this.UIContainer.addChild(this.bankRollText);
    this.UIContainer.addChild(this.yourStakeText);
    this.UIContainer.addChild(this.betAmountText);
    this.UIContainer.addChild(this.betSizeText);
    this.UIContainer.addChild(this.lineNumText);
    this.stage.addChild(this.winLines);
    // Add Big Win & Big Win Text Element as invisible.
    // BigWinContainer contains bigWin & bigWinBackGround
    this.bigWinContainer = new PIXI.Container();
    const bigWin = new Sprite.fromImage('assets/images/slot/circle-big-win-15-x@2x.png');
    bigWin.anchor.set(0.5, 0.5);
    bigWin.position.set(2, 11);
    bigWin.blendMode = PIXI.BLEND_MODES.SCREEN;
    const bigWinBackGround = new Sprite.fromImage('assets/images/slot/big-win-front@2x.png');
    bigWinBackGround.anchor.set(0.5, 0.5);
    bigWinBackGround.alpha = 1;
    this.bigWinContainer.addChild(bigWin);
    this.bigWinContainer.addChild(bigWinBackGround);
    this.bigWinContainer.position.set(470, 340);
    this.bigWinContainer.visible = false;
    this.UIContainer.addChild(this.bigWinContainer);

    this.ovalBackground = new Sprite.fromImage('assets/images/slot/oval-14@2x.png');
    this.ovalBackground.anchor.set(0.5, 0.5);
    this.ovalBackground.position.set(470, 470);
    this.ovalBackground.visible = false;
    this.UIContainer.addChild(this.ovalBackground);

    this.winMoneyText = new Text('+400', {
      fontSize: '80px',
      fontStyle: 'italic',
      letterSpacing: 1.3,
      align: 'center',
      dropShadow: true,
      dropShadowBlur: 30,
      dropShadowAlpha: 0.3,
      dropShadowAngle: 0,
      dropShadowColor: '0xffffff',
      fill: ['0xfbda61', '0xf71c66'],
      fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_VERTICAL,
      fillGradientStops: [0.1, 0.9],
      stroke: '0x681443',
      strokeThickness: 8,
    });
    this.winMoneyText.anchor.set(0.5, 0.5);
    this.winMoneyText.position.set(470, 470);
    this.winMoneyText.visible = false;
    this.UIContainer.addChild(this.winMoneyText);
  }
}
