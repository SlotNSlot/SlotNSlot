import * as PIXI from 'pixi.js';

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
  [{ symbol: 7, length: 5 }], // 2000
  [{ symbol: 6, length: 5 }], // 1000
  [{ symbol: 7, length: 4 }], // 500
  [{ symbol: 7, length: 3 }, { symbol: 6, length: 4 }, { symbol: 5, length: 5 }], // 250
  [{ symbol: 5, length: 4 }, { symbol: 4, length: 5 }], // 150
  [{ symbol: 6, length: 3 }, { symbol: 4, length: 4 }], // 125
  [{ symbol: 5, length: 3 }, { symbol: 3, length: 5 }], // 100
  [{ symbol: 4, length: 3 }, { symbol: 3, length: 4 }, { symbol: 2, length: 5 }], // 75
  [{ symbol: 3, length: 3 }, { symbol: 2, length: 4 }, { symbol: 1, length: 5 }], // 50
  [{ symbol: 2, length: 3 }, { symbol: 1, length: 4 }, { symbol: 0, length: 5 }], // 25
  [{ symbol: 0, length: 2 }], // 10
  [{ symbol: 1, length: 3 }, { symbol: 0, length: 3 }], // 5
];

const WIN_LINE = [
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2],
  [2, 1, 0, 1, 2],
  [0, 1, 2, 1, 2],
  [0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0],
  [1, 0, 0, 0, 1],
  [1, 2, 2, 2, 1],
  [0, 1, 0, 1, 0],
  [2, 1, 2, 1, 2],
  [1, 2, 1, 2, 1],
  [1, 0, 1, 0, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 2, 1, 1],
  [0, 1, 1, 1, 0],
  [2, 1, 1, 1, 2],
  [0, 2, 0, 2, 0],
  [2, 0, 2, 0, 2],
  [2, 0, 1, 0, 2],
];
const WIN_LINE_COLOR = [
  0xc21e42,
  0x68d106,
  0xced42d,
  0x2c2d3e,
  0x2be3be,
  0xb47d58,
  0x9ee54e,
  0x73f42a,
  0x3e99a1,
  0x01891c,
  0x2c0d07,
  0xc526b3,
  0xf746b0,
  0xdcd1f7,
  0x6d2ae,
  0x67704a,
  0x7c3669,
  0xab9e06,
  0x5fb616,
  0x33198f,
];

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
    // PIXI Element
    this.renderer = null;
    this.blurFilter = new PIXI.filters.BlurYFilter(10);
    this.lsdFilter = new PIXI.filters.ColorMatrixFilter();
    this.lsdFilter.lsd();
    this.winLines = new PIXI.Graphics();
    // Game Variable Initialization
    this.stage = null;
    this.gameStatus = STATE_ZERO;
    this.spinStatus = new Array(ENTIRE_REEL_COUNT).fill(true);
    this.rotateStatus = new Array(ENTIRE_REEL_COUNT).fill(false);
    this.slowingDistance = null;
    this.drawingLineIndex = null;
    // Animation Variable Initialization
    this.bigWinPopping = 1; // Inflates when this value is 1, shrinks when this value is -1.
    this.bigWinTextVel = 0;
    this.bigWinTextAcc = 0.003;
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
    let randomNumbers = [];
    // Make Random variable for inital slot.
    for (let idx = 0; idx < ENTIRE_REEL_COUNT; idx += 1) {
      randomNumbers[idx] = [];
      for (let j = 0; j < ITEM_PER_ENTIRE_REEL; j += 1) {
        randomNumbers[idx].push(Math.floor(Math.random() * ALL_SYMBOL_COUNT));
      }
    }

    this.UIContainer = new PIXI.Container();
    const tempContainer = new PIXI.Container();
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
      ])
      .on('progress', (loader, resource) => {
        console.log(loader);
        console.log(resource);
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
        // Random number of Symbol image frames are integrated to animated sprite.
        randomNumbers = randomNumbers.map(reel =>
          reel.map(randomNum => new PIXI.extras.AnimatedSprite(this.symbols[randomNum])),
        );
        // Random symbol's coordinates are set per reelGroup.
        for (let reelNum = 0; reelNum < ENTIRE_REEL_COUNT; reelNum += 1) {
          for (let idx = 0; idx < randomNumbers[reelNum].length; idx += 1) {
            const symbol = randomNumbers[reelNum][idx];
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

        // Add UI Elements.
        const spinBtn = new PIXI.Graphics();
        spinBtn.beginFill(0x6495ed, 1);
        spinBtn.lineStyle(2, 0x000000, 1);
        spinBtn.drawRect(0, 0, 100, 50);
        spinBtn.endFill();
        spinBtn.x = 700;
        spinBtn.y = 525;
        spinBtn.interactive = true;
        spinBtn.buttonMode = true;
        spinBtn.on('pointerdown', this.stopSpin);
        tempContainer.addChild(spinBtn);

        const stopBtn = new PIXI.Graphics();
        stopBtn.beginFill(0xcc0000, 1);
        stopBtn.lineStyle(2, 0x000000, 1);
        stopBtn.drawRect(0, 0, 100, 50);
        stopBtn.endFill();
        stopBtn.x = 800;
        stopBtn.y = 525;
        stopBtn.interactive = true;
        stopBtn.buttonMode = true;

        stopBtn.on('pointerdown', this.drawBigWin);
        tempContainer.addChild(stopBtn);

        this.stage.addChild(tempContainer);
        this.stage.addChild(this.UIContainer);
        // Tell the `renderer` to `render` the `stage`
        this.renderer.render(this.stage);
        // When load function is ended, then start gameLoop
        this.gameLoop();
      });
  }

  startSpin() {
    if (this.gameStatus === STATE_WAITING) {
      this.winLines.clear();
      this.gameStatus = STATE_SPINNING;
      this.reelGroup.forEach(reel => {
        reel.vy = 100;
        reel.filters = [this.blurFilter];
      });
      this.spinStatus.fill(true);
      this.bigWinContainer.visible = false;
      this.bigWinText.visible = false;
      this.ovalBackground.visible = false;
    }
  }

  gameLoop() {
    if (this.gameStatus === STATE_ZERO) {
      this.gameStatus = STATE_WAITING;
    } else if (this.gameStatus === STATE_WAITING) {
      if (this.betSize !== undefined) this.betSizeText.text = this.betSize;
      if (this.lineNum !== undefined) this.lineNumText.text = `${this.lineNum}`;
      if (this.yourStake !== undefined) this.yourStakeText.text = `${this.yourStake} ETH`;
      if (this.bankRoll !== undefined) this.bankRollText.text = `${this.bankRoll} ETH`;
      if (this.lineNum !== undefined && this.betSize !== undefined)
        this.betAmountText.text = this.betSize * this.lineNum;
      if (this.bigWinContainer.visible) {
        this.bigWinContainer.scale.x += 0.005 * this.bigWinPopping;
        this.bigWinContainer.scale.y += 0.005 * this.bigWinPopping;
        if (Math.abs(this.bigWinContainer.scale.x - 1) > 0.15) {
          this.bigWinPopping *= -1;
        }
      }
      console.log('WAITING...');
      // console.log('WAITING...');
    } else if (this.gameStatus === STATE_SPINNING) {
      this.reelGroup.forEach(reel => {
        reel.y += reel.vy;
        if (reel.y > reel.height) {
          reel.y -= reel.height * 2;
        }
      });
    } else if (this.gameStatus === STATE_STOPPING) {
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
    } else if (this.gameStatus === STATE_DRAWING) {
      if (this.drawingLineIndex < this.drawingPercentageList.length) {
        // Draw until matching percentage List
        if (this.drawingPercentageList[this.drawingLineIndex] <= this.matchingPercentageList[this.drawingLineIndex]) {
          // Drawing Line percentage's intensification factor. When it's larger, it draws faster.
          this.drawingPercentageList[this.drawingLineIndex] += 0.05;
          // Current line's drawing percentage
          const p = this.drawingPercentageList[this.drawingLineIndex];
          let moveX;
          let moveY;
          let partP;
          let angle;
          const lineNum = this.testWinLines[this.drawingLineIndex];
          this.winLines.lineStyle(4, WIN_LINE_COLOR[lineNum], 0.8);
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
        this.stage.addChild(this.winLines);
      } else {
        this.drawingPercentageList = null;
        this.gameStatus = STATE_WAITING;
      }
    } else if (this.gameStatus === STATE_BIG_WIN) {
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
        if (this.bigWinText.scale.x <= 1) {
          this.bigWinTextVel += this.bigWinTextAcc;
          this.bigWinText.scale.x += this.bigWinTextVel;
          this.bigWinText.scale.y += this.bigWinTextVel;
          this.bigWinText.alpha += this.bigWinTextVel;
          this.ovalBackground.scale.x += this.bigWinTextVel;
          this.ovalBackground.scale.y += this.bigWinTextVel;
          this.ovalBackground.alpha += this.bigWinTextVel;
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
        this.gameStatus = STATE_WAITING;
      }
    }

    // Render the stage to see the animation
    window.requestAnimationFrame(this.gameLoop);
    this.renderer.render(this.stage);
  }

  drawBigWin() {
    if (this.gameStatus === STATE_SPINNING) {
      this.gameStatus = STATE_BIG_WIN;
      this.bigWinPercentage = 0;
      this.bigWinTextVel = 0;
      this.bigWinContainer.visible = true;
      this.bigWinContainer.scale.set(0, 0);
      this.bigWinContainer.alpha = 0;
      this.bigWinText.visible = true;
      this.bigWinText.scale.set(0, 0);
      this.bigWinText.alpha = 0;
      this.ovalBackground.visible = true;
      this.ovalBackground.scale.set(0, 0);
      this.ovalBackground.alpha = 0;
      this.reelGroup.forEach(reel => {
        reel.filters = [this.lsdFilter, this.blurFilter];
      });
      this.changeSlot();
    }
  }
  async stopSpin() {
    if (this.gameStatus === STATE_SPINNING) {
      this.gameStatus = STATE_STOPPING;
      this.slowingDistance = new Array(ENTIRE_REEL_COUNT * 2).fill(SLOWING_DISTANCE);
      await this.changeSlot();
      for (let i = 0; i < ENTIRE_REEL_COUNT; i += 1) {
        await this.stopReel(i);
      }
      // After reels stop, draw win lines.
      await this.drawLine();
    }
  }

  drawLine() {
    this.gameStatus = STATE_DRAWING;
    this.testWinLines = [0, 4, 8, 10, 12, 16, 18];
    this.drawingPercentageList = new Array(this.testWinLines.length).fill(0);
    this.matchingPercentageList = [1, 1, 0.5, 0.75, 1, 0.5, 1];
    this.drawingLineIndex = 0;
  }

  stopReel(reelNum) {
    return new Promise(resolve => {
      this.spinStatus[reelNum] = false;
      this.rotateStatus[reelNum] = true;
      setTimeout(() => {
        this.rotateStatus[reelNum] = false;
        if (reelNum === ENTIRE_REEL_COUNT - 1) {
          this.gameStatus = STATE_DRAWING;
          this.reelGroup = this.newReelGroup;
        }
        resolve(reelNum);
      }, 2000);
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

  calculateSlot() {
    const randLineNum = Math.floor(Math.random() * 20);
    let sumPrize = this.makeRandomPrize(randLineNum);
    const lines = [];
    if (sumPrize !== 0) {
      for (let i = 0; i < PROBABILITY_VALUE_TABLE.length; i += 1) {
        // Prize has to be selected by reverse order.
        const prize = PROBABILITY_VALUE_TABLE[PROBABILITY_VALUE_TABLE.length - 1 - i];
        if (sumPrize >= prize) {
          const prizeNum = Math.floor(sumPrize / prize);
          for (let j = 0; j < prizeNum; j += 1) {
            const randIndex = Math.floor(Math.random() * LINE_CASES[i].length);
            lines.push(LINE_CASES[i][randIndex]);
            sumPrize -= prize;
          }
        }
      }
    }
  }

  changeSlot() {
    this.newReelGroup = new Array(ENTIRE_REEL_COUNT * 2).fill(1);
    this.newReelGroup.forEach((reelItem, index) => {
      this.newReelGroup[index] = new PIXI.Container();
      this.newReelGroup[index].vy = 0;
    });
    for (let reelNum = 0; reelNum < ENTIRE_REEL_COUNT; reelNum += 1) {
      for (let idx = 0; idx < ITEM_PER_ENTIRE_REEL; idx += 1) {
        const symbol = new PIXI.extras.AnimatedSprite(this.symbols[1]);
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
  }

  removeCurrentGame() {
    PIXI.loader.reset();
    this.canvas.remove();
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
    slotBackground.position.set(43, 120);
    slotBackground.width = 855;
    slotBackground.height = 461;

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
    this.yourStakeText.text = document.getElementById('your-balance').innerText + ' ETH';
    this.yourStakeText.position.set(360, 30);
    this.yourStakeText.anchor.x = 1;
    this.yourStakeText.style.align = 'right';

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
    this.bankRollText.text = '13' + ' ETH';
    this.bankRollText.position.set(590, 30);

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
    this.betAmountText.text = '0.4';
    this.betAmountText.position.set(117, 610);
    this.betAmountText.anchor.x = 0.5;

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
    this.betSizeText.text = '0.1';
    this.betSizeText.position.set(283, 610);
    this.betSizeText.anchor.x = 0.5;

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
      if (this.betSize - this.betUnit >= this.minBet) {
        this.setBetSize(this.betSize - this.betUnit);
      } else {
        this.setBetSize(this.minBet);
      }
    });
    betMinusBtn.endFill();

    const betPlusBtn = new Graphics();
    betPlusBtn.beginFill(0, 0);
    betPlusBtn.drawRect(333, 583, 38, 57);
    betPlusBtn.interactive = true;
    betPlusBtn.buttonMode = true;
    betPlusBtn.on('pointerdown', () => {
      if (this.betSize + this.betUnit <= this.maxBet) {
        this.setBetSize(this.betSize + this.betUnit);
      } else {
        this.setBetSize(this.maxBet);
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
      this.setBetSize(this.maxBet);
      this.setLineNum(20);
    });

    const lineNum = new Sprite(TextureCache['line.png']);
    lineNum.position.set(436, 580);
    lineNum.width = 186;
    lineNum.height = 65;
    this.lineNumText.text = '4';
    this.lineNumText.position.set(529, 610);
    this.lineNumText.anchor.x = 0.5;

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

    const autoBtn = new Sprite(TextureCache['auto.png']);
    autoBtn.position.set(804, 580);
    autoBtn.width = 93;
    autoBtn.height = 65;
    autoBtn.interactive = true;
    autoBtn.buttonMode = true;

    this.stage.addChild(slotBackground);
    this.UIContainer.addChild(mergedBackground);
    this.UIContainer.addChild(ribbon);
    this.UIContainer.addChild(yourStake);
    this.UIContainer.addChild(this.yourStakeText);
    this.UIContainer.addChild(bankRoll);
    this.UIContainer.addChild(this.bankRollText);
    this.UIContainer.addChild(betAmount);
    this.UIContainer.addChild(this.betAmountText);
    this.UIContainer.addChild(betSize);
    this.UIContainer.addChild(betMinusBtn);
    this.UIContainer.addChild(betPlusBtn);
    this.UIContainer.addChild(maxBet);
    this.UIContainer.addChild(lineNum);
    this.UIContainer.addChild(lineMinusBtn);
    this.UIContainer.addChild(linePlusBtn);
    this.UIContainer.addChild(spinBtn);
    this.UIContainer.addChild(autoBtn);
    // Text Component
    this.UIContainer.addChild(ribbonText);
    this.UIContainer.addChild(this.bankRollText);
    this.UIContainer.addChild(this.yourStakeText);
    this.UIContainer.addChild(this.betAmountText);
    this.UIContainer.addChild(this.betSizeText);
    this.UIContainer.addChild(this.lineNumText);
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

    this.bigWinText = new Text('+400', {
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
    this.bigWinText.anchor.set(0.5, 0.5);
    this.bigWinText.position.set(470, 470);
    this.bigWinText.visible = false;
    this.UIContainer.addChild(this.bigWinText);
  }
}
